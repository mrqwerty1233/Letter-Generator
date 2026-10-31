import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LetterConfig } from '../types/letter';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl.startsWith('http');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Generates a clean short slug ID for a shared letter (e.g. "elise-9f3k2").
 */
export function createShortSlug(recipientName: string): string {
  const slugBase = String(recipientName || 'beloved')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 16);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${slugBase || 'love'}-${rand}`;
}

/**
 * Compresses an uploaded image file on an HTML5 canvas to 1280px max dimension.
 * If Supabase Storage is configured (`album-photos` bucket), uploads the compressed
 * JPEG blob and returns the permanent public `https://` URL.
 * Otherwise, returns the compressed JPEG Data URL.
 */
export async function uploadOrCompressPhoto(
  file: File,
  slideIndex: number
): Promise<string> {
  const { dataUrl, blob } = await compressImageFile(file);

  if (supabase && blob) {
    try {
      const ext = 'jpg';
      const safeName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 24);
      const filePath = `slides/${Date.now()}-${slideIndex + 1}-${safeName || 'memory'}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('album-photos')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from('album-photos')
          .getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch {
      // Fall back to compressed dataUrl if Supabase Storage bucket is not yet created
    }
  }

  return dataUrl;
}

/**
 * Saves a LetterConfig to Supabase (`public.letters` table) if configured,
 * and also attempts the local Express `/api/letters` endpoint as fallback.
 */
export async function persistSharedLetter(
  config: LetterConfig
): Promise<string> {
  const shortId = createShortSlug(config.recipientName);
  const recordToSave: LetterConfig = { ...config, id: shortId };

  // 1. Try saving to Supabase `public.letters`
  if (supabase) {
    try {
      const { error } = await supabase.from('letters').upsert(
        {
          id: shortId,
          recipient_name: config.recipientName,
          sender_name: config.senderName,
          occasion_date: config.occasionDate,
          letter_data: recordToSave,
        },
        { onConflict: 'id' }
      );
      if (!error) {
        return shortId;
      }
    } catch {
      // Fall through to local API fallback
    }
  }

  // 2. Fallback: Save to Express `/api/letters` endpoint (when running in AI Studio)
  try {
    const response = await fetch('/api/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letter: recordToSave }),
    });
    if (response.ok) {
      const saved = await response.json();
      if (saved?.id) {
        return saved.id;
      }
    }
  } catch {
    // Ignore when hosted on static Vercel without backend server
  }

  return shortId;
}

/**
 * Loads a saved LetterConfig by short ID from Supabase (`public.letters`) first,
 * falling back to `/api/letters/:id`.
 */
export async function fetchSharedLetterById(
  shortId: string
): Promise<LetterConfig | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('letters')
        .select('letter_data')
        .eq('id', shortId)
        .single();

      if (!error && data?.letter_data) {
        return data.letter_data as LetterConfig;
      }
    } catch {
      // Fall through to local API
    }
  }

  try {
    const res = await fetch(`/api/letters/${encodeURIComponent(shortId)}`);
    if (res.ok) {
      const payload = await res.json();
      if (payload?.letter) {
        return payload.letter as LetterConfig;
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

function compressImageFile(
  file: File
): Promise<{ dataUrl: string; blob: Blob | null }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawResult = typeof reader.result === 'string' ? reader.result : '';
      if (!rawResult) {
        resolve({ dataUrl: '', blob: null });
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width >= height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
            canvas.toBlob(
              (blob) => {
                resolve({ dataUrl: compressedDataUrl, blob });
              },
              'image/jpeg',
              0.84
            );
            return;
          }
        } catch {
          // Fall back to raw data URL
        }
        resolve({ dataUrl: rawResult, blob: null });
      };
      img.onerror = () => {
        resolve({ dataUrl: rawResult, blob: null });
      };
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  });
}

import {
  CountdownParts,
  LetterConfig,
  OccasionType,
  ValidationResult,
} from '../types/letter';
import { VINTAGE_ARTWORKS } from './vintageArtworks';

export const DEFAULT_BIRTHDAY_LETTER: LetterConfig = {
  id: 'nov01-birthday-2026',
  occasionType: 'birthday',
  occasionTitle: 'Happy Birthday, My Love',
  occasionDate: '2026-11-01',
  recipientName: 'Elise',
  senderName: 'Julian',
  salutation: 'My Dearest Elise,',
  paragraphs: [
    'As the calendar turns to the first of November, 2026, the whole world seems to pause in golden autumn light just to celebrate the day you arrived in it. Every season with you feels like unsealing a rare vintage letter—full of warmth, quiet wonder, and a grace I never knew my life was missing until I met you.',
    'Looking back through our favorite photographs, I am reminded that happiness is not a grand, distant place; it is the sound of your laugh over late-night coffee, the warmth of your hand in mine on chilly evenings, and the gentle way you turn ordinary afternoons into memories I want to keep forever.',
    'May this new year of your life bring you every dream your heart holds close. No matter where the coming years lead us, my favorite place in this world will always be right beside you.',
  ],
  pullQuote:
    'In a world of fleeting moments, loving you is the timeless story I want to read forever.',
  signOff: 'Forever & Always Yours,',
  postscript:
    'P.S. Keep your evening free on November 1st—your birthday surprise begins at sunset.',
  waxSealStyle: 'heart_crest',
  waxMonogram: 'J♥E',
  musicTrack: 'november_waltz',
  envelopeSubtext: 'To Be Opened on November 01, 2026 · Personal & Cherished',
  slides: [
    {
      id: 'slide-1',
      title: 'Autumn Golden Hour Walk',
      caption:
        'Walking hand in hand beneath the crimson leaves—where every conversation feels timeless.',
      memoryDate: 'November 01, 2026',
      location: 'Botanical Promenade',
      imageUrl: VINTAGE_ARTWORKS.golden_hour_promenade.dataUri,
      presetKey: 'golden_hour_promenade',
    },
    {
      id: 'slide-2',
      title: 'Candlelight & Merlot',
      caption:
        'A quiet toast by candlelight to the laughter, inside jokes, and late-night talks we share.',
      memoryDate: 'Autumn Evening',
      location: 'Our Favorite Corner Table',
      imageUrl: VINTAGE_ARTWORKS.candlelight_merlot_toast.dataUri,
      presetKey: 'candlelight_merlot_toast',
    },
    {
      id: 'slide-3',
      title: 'Wishes Under November Skies',
      caption:
        'Here is to your birthday wish coming true tonight and every year that follows.',
      memoryDate: 'November 01, 2026 · Midnight',
      location: 'Under the Stars',
      imageUrl: VINTAGE_ARTWORKS.stargazing_birthday_wish.dataUri,
      presetKey: 'stargazing_birthday_wish',
    },
    {
      id: 'slide-4',
      title: 'Written in Wine & Gold',
      caption:
        'Every note, postcard, and memory saved in our personal archive of love.',
      memoryDate: 'Always & Forever',
      location: 'Maison d’Amour Archive',
      imageUrl: VINTAGE_ARTWORKS.wax_seal_atelier.dataUri,
      presetKey: 'wax_seal_atelier',
    },
  ],
};

export const OCCASION_PRESETS: Record<
  OccasionType,
  {
    label: string;
    occasionTitle: string;
    defaultDate: string;
    envelopeSubtext: string;
    salutationTemplate: (name: string) => string;
    paragraphs: string[];
    pullQuote: string;
    postscript: string;
  }
> = {
  birthday: {
    label: 'Girlfriend Birthday (Nov 01, 2026)',
    occasionTitle: 'Happy Birthday, My Love',
    defaultDate: '2026-11-01',
    envelopeSubtext: 'To Be Opened on November 01, 2026 · Birthday Keepsake',
    salutationTemplate: (name) => `My Dearest ${name || 'Love'},`,
    paragraphs: DEFAULT_BIRTHDAY_LETTER.paragraphs,
    pullQuote: DEFAULT_BIRTHDAY_LETTER.pullQuote,
    postscript: DEFAULT_BIRTHDAY_LETTER.postscript,
  },
  anniversary: {
    label: 'Romantic Anniversary',
    occasionTitle: 'Happy Anniversary, My Darling',
    defaultDate: '2026-11-01',
    envelopeSubtext: 'Commemorating Another Year of Us · Sealed in Gold',
    salutationTemplate: (name) => `To My Beloved ${name || 'Partner'},`,
    paragraphs: [
      'Another year has woven itself into our story, and with each passing month my gratitude for you only deepens. From the first day our paths crossed, you have brought a rare warmth and poetry into my life.',
      'Through quiet mornings and grand adventures alike, you have been my steady anchor and my favorite confidante. Every photograph here holds a chapter of the life we are building side by side.',
      'Here is to all the years behind us, and to the countless golden chapters waiting ahead.',
    ],
    pullQuote:
      'Every year with you is my favorite chapter in the story of us.',
    postscript: 'P.S. Thank you for making every day feel worth celebrating.',
  },
  valentine: {
    label: 'Valentine & Romance',
    occasionTitle: 'Be Mine, Forever & Always',
    defaultDate: '2027-02-14',
    envelopeSubtext: 'A Private Devotion · Written by Candlelight',
    salutationTemplate: (name) => `To the Keeper of My Heart, ${name || 'My Love'},`,
    paragraphs: [
      'If I were given a thousand pages of cotton parchment and a lifetime of ink, I would still fall short of describing how deeply you mean to me.',
      'You are the warmth in winter, the melody that lingers long after the song ends, and the person I look for in every crowded room.',
    ],
    pullQuote: 'You are my favorite thought at dawn and my sweetest peace at midnight.',
    postscript: 'P.S. My heart belongs to you, today and always.',
  },
  apology: {
    label: 'Heartfelt Apology & Peace',
    occasionTitle: 'From the Depths of My Heart',
    defaultDate: '2026-11-01',
    envelopeSubtext: 'Offered with Humility, Patience & Devotion',
    salutationTemplate: (name) => `Dearest ${name || 'Love'},`,
    paragraphs: [
      'I am writing this letter because you deserve thoughtful words, patience, and my whole honesty. Looking back, I realize how much your peace and happiness mean to me, and I am truly sorry for the hurt I caused.',
      'Nothing matters more to me than the trust we share and the gentleness of our bond. I hope these words and our cherished memories remind you how deeply I value us.',
    ],
    pullQuote: 'Loving you means listening, learning, and choosing us above pride.',
    postscript: 'P.S. Whenever you are ready, I am here with open arms.',
  },
  just_because: {
    label: 'Just Because / Surprise Note',
    occasionTitle: 'A Little Note Just For You',
    defaultDate: '2026-11-01',
    envelopeSubtext: 'No Special Occasion Needed to Love You',
    salutationTemplate: (name) => `My Sweetest ${name || 'Love'},`,
    paragraphs: [
      'We do not need a holiday on the calendar for me to pause and tell you how extraordinary you are. Today, right in the middle of an ordinary week, I caught myself smiling just thinking of you.',
      'Thank you for the light you bring into my world simply by being yourself.',
    ],
    pullQuote: 'Even the quietest day becomes an occasion when I spend it with you.',
    postscript: 'P.S. Read this again whenever you need a reminder of how loved you are.',
  },
};

/**
 * Encodes a LetterConfig into a URL-safe Base64 string so generated URLs work
 * reliably across devices even without server state.
 * Preserves preset keys to keep the URL compact when using built-in artworks.
 */
export function encodeLetterToHash(config: LetterConfig): string {
  const compactPayload = {
    ...config,
    slides: config.slides.map((s) => ({
      ...s,
      // If imageUrl matches a known preset artwork, omit the bulky SVG string and restore on decode
      imageUrl:
        s.presetKey && VINTAGE_ARTWORKS[s.presetKey] ? '' : s.imageUrl,
    })),
  };
  const json = JSON.stringify(compactPayload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decodes a URL-safe Base64 string back into a complete LetterConfig.
 */
export function decodeLetterFromHash(encoded: string): LetterConfig | null {
  try {
    const cleaned = encoded.trim().replace(/^#?letter=/, '');
    if (!cleaned) return null;
    const base64 = cleaned.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (base64.length % 4)) % 4;
    const padded = base64 + '='.repeat(padLen);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as LetterConfig;
    if (!parsed || typeof parsed.recipientName !== 'string' || !Array.isArray(parsed.slides)) {
      return null;
    }
    return {
      ...parsed,
      slides: parsed.slides.map((slide, idx) => {
        const restoredUrl =
          slide.presetKey && VINTAGE_ARTWORKS[slide.presetKey]
            ? VINTAGE_ARTWORKS[slide.presetKey].dataUri
            : slide.imageUrl || VINTAGE_ARTWORKS.golden_hour_promenade.dataUri;
        return {
          ...slide,
          id: slide.id || `slide-${idx + 1}`,
          imageUrl: restoredUrl,
        };
      }),
    };
  } catch {
    return null;
  }
}

/**
 * Generates a full shareable URL combining optional short key and self-contained hash.
 */
export function createShareUrl(
  origin: string,
  pathname: string,
  config: LetterConfig,
  shortId?: string
): string {
  const hash = encodeLetterToHash(config);
  const base = `${origin.replace(/\/$/, '')}${pathname || '/'}`;
  const query = shortId
    ? `?k=${encodeURIComponent(shortId)}&view=gift`
    : `?view=gift`;
  return `${base}${query}#letter=${hash}`;
}

/**
 * Computes countdown or celebration metrics toward the target occasion date (e.g. 2026-11-01).
 */
export function getOccasionCountdown(
  occasionDateIso: string,
  nowMs: number = Date.now()
): CountdownParts {
  const parts = occasionDateIso.split('-').map((n) => parseInt(n, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isToday: true,
      isPast: false,
      label: 'Special Occasion Day',
    };
  }
  const [year, month, day] = parts;
  const targetStart = new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
  const targetEnd = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();

  if (nowMs >= targetStart && nowMs <= targetEnd) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isToday: true,
      isPast: false,
      label: 'Today Is the Special Day',
    };
  }

  if (nowMs < targetStart) {
    const diffMs = targetStart - nowMs;
    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return {
      days,
      hours,
      minutes,
      isToday: false,
      isPast: false,
      label: `${days}d ${hours}h ${minutes}m until ${formatEditorialDate(occasionDateIso)}`,
    };
  }

  const diffPastDays = Math.floor((nowMs - targetStart) / (1000 * 60 * 60 * 24));
  return {
    days: diffPastDays,
    hours: 0,
    minutes: 0,
    isToday: false,
    isPast: true,
    label: `Celebrated on ${formatEditorialDate(occasionDateIso)}`,
  };
}

export function formatEditorialDate(isoDate: string): string {
  const parts = isoDate.split('-').map((n) => parseInt(n, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return isoDate;
  }
  const [year, month, day] = parts;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthName = months[month - 1] || 'November';
  const paddedDay = String(day).padStart(2, '0');
  return `${monthName} ${paddedDay}, ${year}`;
}

export function getWaxSealMonogram(
  senderName: string,
  recipientName: string,
  customMonogram?: string
): string {
  if (customMonogram && customMonogram.trim().length > 0) {
    return Array.from(customMonogram.trim()).slice(0, 6).join('').toUpperCase();
  }
  const s = Array.from((senderName || '').trim())[0]?.toUpperCase() || 'A';
  const r = Array.from((recipientName || '').trim())[0]?.toUpperCase() || 'B';
  return `${s}♥${r}`;
}

export function validateLetterConfig(config: LetterConfig): ValidationResult {
  const errors: Record<string, string> = {};
  if (!config.recipientName || !config.recipientName.trim()) {
    errors.recipientName = 'Please enter her name for the envelope and salutation.';
  }
  if (!config.occasionTitle || !config.occasionTitle.trim()) {
    errors.occasionTitle = 'Please provide an occasion headline.';
  }
  if (!config.occasionDate || !/^\d{4}-\d{2}-\d{2}$/.test(config.occasionDate)) {
    errors.occasionDate = 'Please select a valid date (YYYY-MM-DD).';
  }
  const nonEmptyParagraphs = (config.paragraphs || []).filter((p) => p.trim().length > 0);
  if (nonEmptyParagraphs.length === 0) {
    errors.paragraphs = 'Please write at least one paragraph for your open letter.';
  }
  if (!config.slides || config.slides.length === 0) {
    errors.slides = 'Please include at least one photo slide in the gallery.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

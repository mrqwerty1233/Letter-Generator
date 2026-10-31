import {
  CountdownParts,
  LetterConfig,
  OccasionType,
  ValidationResult,
} from '../types/letter';
import { VINTAGE_ARTWORKS } from './vintageArtworks';

export const DEFAULT_BIRTHDAY_LETTER: LetterConfig = {
  id: 'shane-birthday-2026',
  occasionType: 'birthday',
  occasionTitle: 'Happy Birthday, Mahal ko',
  occasionDate: '2026-11-01',
  recipientName: 'Shane',
  senderName: 'Your Vin',
  salutation: 'Dear Mahal,',
  paragraphs: [
    "Happy Birthday Mahal 🥳💕, sorry Mahal kung ito lang kaya ko ibigay 🥺. Sorry kung wala ako kahit anong gift sayo 🥺. Wish ko for you Mahal, sana matupad lahat ng wish and dreams mo. For now wala ako maitulong sayo Mahal ko, you always giving me what you have, sorry talaga Mahal kung wala akong maitulong sayo. Promise ko mahal, na kung makapag trabaho and matuloy tayo abroad I'll give you everything at babawi ako sa lahat ng pagkukulang ko sayo. I can't date you anywhere, I can't even buy you a gift, salita lang anibibigay ko sang-ayon, I really sorry Mahal, kung wala talaga ako matibay kahit ano lang. Thank you for everything you've done for me Mahal, kahit alam mo sa sarili mo hirap na hirap kana. Happy Birthday Mahal ko, I Love you soooo muchhh. Promise po babawi ako pag natapos na lahat ng problema natin. I LOVE YOUUUUU! 🩷🩷🩷🩷",
  ],
  pullQuote:
    "Thank you for everything you've done for me, Mahal ko—I love you so much, always and forever.",
  signOff: 'Forever & Always Yours,',
  postscript: 'Happy Birthday Mahal, I LOVE YOU',
  waxSealStyle: 'heart_crest',
  waxMonogram: 'M❤S',
  musicTrack: 'november_waltz',
  envelopeSubtext: 'To Be Opened on November 01, 2026 · For My Mahal, Shane',
  slides: [
    {
      id: 'slide-1',
      title: 'Always Better Together',
      caption:
        'Every moment right beside you is my favorite place in the world, Mahal ko.',
      memoryDate: 'November 01, 2026',
      location: 'My Favorite Smile',
      imageUrl: '/assets/aistudio/received_361784942864372_7e8c8440.jpeg',
    },
    {
      id: 'slide-2',
      title: 'The Way You Look at Me',
      caption:
        'Thank you for always staying by my side and giving me your whole heart, Mahal.',
      memoryDate: 'Cherished Memory',
      location: 'Forever Grateful for You',
      imageUrl: '/assets/aistudio/received_6506592386119599_79e6cc23.jpeg',
    },
    {
      id: 'slide-3',
      title: 'My Beautiful Mahal, Shane',
      caption:
        'May all of your wishes and dreams come true today and in all the years ahead.',
      memoryDate: 'November 01, 2026',
      location: 'Happy Birthday, Mahal Ko',
      imageUrl:
        '/assets/aistudio/Messenger_creation_A328EFB2-EA64-4480-9E9E-E8DB13B0CC16_475ac7d6.jpeg',
    },
    {
      id: 'slide-4',
      title: 'Celebrating You Always',
      caption:
        'Promise ko Mahal, babawi ako sa lahat—I love you so much, today and forever.',
      memoryDate: 'November 01, 2026',
      location: 'With All My Love, Your Vin',
      imageUrl: '/assets/aistudio/received_865129438535210_320e9526.jpeg',
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
    occasionTitle: 'Happy Birthday, Mahal ko',
    defaultDate: '2026-11-01',
    envelopeSubtext: 'To Be Opened on November 01, 2026 · Birthday Keepsake',
    salutationTemplate: (name) => `Dear ${name || 'Mahal'},`,
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

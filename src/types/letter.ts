export type OccasionType =
  | 'birthday'
  | 'anniversary'
  | 'valentine'
  | 'apology'
  | 'just_because';

export type MusicTrackId =
  | 'november_waltz'
  | 'clair_nocturne'
  | 'forever_serenade'
  | 'candlelight_minuet';

export type WaxSealStyle = 'heart_crest' | 'rose_emblem' | 'crown_monogram' | 'celestial_star';

export interface PhotoSlide {
  id: string;
  title: string;
  caption: string;
  memoryDate: string;
  location: string;
  imageUrl: string;
  presetKey?: string;
}

export interface LetterConfig {
  id: string;
  occasionType: OccasionType;
  occasionTitle: string;
  occasionDate: string; // YYYY-MM-DD, default '2026-11-01'
  recipientName: string;
  senderName: string;
  salutation: string;
  paragraphs: string[];
  pullQuote: string;
  signOff: string;
  postscript: string;
  waxSealStyle: WaxSealStyle;
  waxMonogram: string;
  musicTrack: MusicTrackId;
  customAudioUrl?: string;
  slides: PhotoSlide[];
  envelopeSubtext: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
  isPast: boolean;
  label: string;
}

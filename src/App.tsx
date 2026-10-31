import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  Image as ImageIcon,
  Music,
  Pause,
  PenTool,
  Play,
  Plus,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
} from 'lucide-react';
import {
  LetterConfig,
  MusicTrackId,
  OccasionType,
  PhotoSlide,
} from './types/letter';
import {
  DEFAULT_BIRTHDAY_LETTER,
  OCCASION_PRESETS,
  createShareUrl,
  decodeLetterFromHash,
  formatEditorialDate,
  validateLetterConfig,
} from './utils/letterCodec';
import { VINTAGE_ARTWORKS } from './utils/vintageArtworks';
import { MUSIC_TRACKS, musicBox } from './utils/musicSynthesizer';
import { VintageEnvelopeStage } from './components/VintageEnvelopeStage';
import { VintagePhotoSlideshow } from './components/VintagePhotoSlideshow';
import { GeminiPoeticAtelier } from './components/GeminiPoeticAtelier';
import { ShareUrlModal } from './components/ShareUrlModal';
import { FlowerBloomOrnament } from './components/FlowerBloomOrnament';
import {
  fetchSharedLetterById,
  persistSharedLetter,
  uploadOrCompressPhoto,
} from './utils/supabaseStorage';

type StudioTab = 'letter' | 'slides' | 'music' | 'gemini';

/**
 * Determine if the current URL is the standalone Generated Output Website
 * (i.e., opened via a shared link with ?k=..., ?view=gift, ?view=recipient, or #letter=...).
 */
function detectStandaloneGiftUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  const shortKey = params.get('k');
  const hash = window.location.hash;
  return (
    view === 'gift' ||
    view === 'recipient' ||
    Boolean(shortKey) ||
    (Boolean(hash) && hash.includes('letter='))
  );
}

export default function App() {
  const [config, setConfig] = useState<LetterConfig>(DEFAULT_BIRTHDAY_LETTER);
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTab>('letter');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);

  // Separate Generator Mode vs Standalone Generated Output Mode
  const [isStandaloneGiftUrl, setIsStandaloneGiftUrl] = useState<boolean>(() =>
    detectStandaloneGiftUrl()
  );
  const [isPreviewingOutput, setIsPreviewingOutput] = useState<boolean>(false);

  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.5);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [generatedShareUrl, setGeneratedShareUrl] = useState<string>('');
  const [generatedShortUrl, setGeneratedShortUrl] = useState<string>('');
  const [isSavingShare, setIsSavingShare] = useState<boolean>(false);

  // Load shared letter data when visiting a generated URL (?k=... or #letter=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shortKey = params.get('k');
    const autostart = params.get('autostart');
    const hash = window.location.hash;

    if (detectStandaloneGiftUrl()) {
      setIsStandaloneGiftUrl(true);
    }

    if (autostart === '1') {
      setIsEnvelopeOpen(true);
    }

    if (hash && hash.includes('letter=')) {
      const decoded = decodeLetterFromHash(hash);
      if (decoded) {
        setConfig(decoded);
      }
    }

    if (shortKey) {
      fetchSharedLetterById(shortKey)
        .then((savedLetter) => {
          if (savedLetter) {
            setConfig(savedLetter);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    return () => {
      musicBox.stop();
    };
  }, []);

  const toggleMusicPlayback = () => {
    if (isPlayingMusic) {
      musicBox.stop();
      setIsPlayingMusic(false);
    } else {
      musicBox.setVolume(musicVolume);
      musicBox.start(config.musicTrack, config.customAudioUrl);
      setIsPlayingMusic(true);
    }
  };

  const handleStartMusicOnUnseal = () => {
    if (!isPlayingMusic) {
      musicBox.setVolume(musicVolume);
      musicBox.start(config.musicTrack, config.customAudioUrl);
      setIsPlayingMusic(true);
    }
  };

  const handleSelectTrack = (trackId: MusicTrackId) => {
    setConfig((prev) => ({ ...prev, musicTrack: trackId }));
    if (isPlayingMusic) {
      musicBox.start(trackId, config.customAudioUrl);
    }
  };

  const handleVolumeChange = (nextVol: number) => {
    setMusicVolume(nextVol);
    musicBox.setVolume(nextVol);
  };

  const handleOccasionChange = (nextOccasion: OccasionType) => {
    const preset = OCCASION_PRESETS[nextOccasion];
    setConfig((prev) => ({
      ...prev,
      occasionType: nextOccasion,
      occasionTitle: preset.occasionTitle,
      occasionDate: preset.defaultDate,
      envelopeSubtext: preset.envelopeSubtext,
      salutation: preset.salutationTemplate(prev.recipientName),
      paragraphs: preset.paragraphs,
      pullQuote: preset.pullQuote,
      postscript: preset.postscript,
    }));
    setValidationErrors({});
  };

  const handleGenerateShareUrl = async () => {
    const check = validateLetterConfig(config);
    if (!check.valid) {
      setValidationErrors(check.errors);
      if (check.errors.slides) {
        setActiveStudioTab('slides');
      } else {
        setActiveStudioTab('letter');
      }
      return;
    }
    setValidationErrors({});
    setIsSavingShare(true);

    let shortId = config.id || `love-${Date.now().toString(36)}`;
    try {
      shortId = await persistSharedLetter(config);
    } catch {
      // Fallback gracefully to portable hash URL
    } finally {
      setIsSavingShare(false);
    }

    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const fullPortableUrl = createShareUrl(origin, pathname, config, shortId);
    const cleanShortUrl = `${origin.replace(/\/$/, '')}${pathname}?k=${encodeURIComponent(
      shortId
    )}&view=gift`;

    setGeneratedShareUrl(fullPortableUrl);
    setGeneratedShortUrl(cleanShortUrl);
    setShareModalOpen(true);
  };

  const handleSlideFieldUpdate = (
    index: number,
    field: keyof PhotoSlide,
    value: string
  ) => {
    setConfig((prev) => {
      const updated = [...prev.slides];
      updated[index] = {
        ...updated[index],
        [field]: value,
        ...(field === 'imageUrl' ? { presetKey: undefined } : {}),
      };
      return { ...prev, slides: updated };
    });
  };

  const handleAddSlide = () => {
    const artKeys = Object.keys(VINTAGE_ARTWORKS);
    const nextArtKey = artKeys[config.slides.length % artKeys.length];
    const art = VINTAGE_ARTWORKS[nextArtKey];
    const newSlide: PhotoSlide = {
      id: `slide-${Date.now()}`,
      title: art.label,
      caption: 'Another unforgettable chapter in our story together.',
      memoryDate: formatEditorialDate(config.occasionDate),
      location: 'Cherished Memory',
      imageUrl: art.dataUri,
      presetKey: art.id,
    };
    setConfig((prev) => ({ ...prev, slides: [...prev.slides, newSlide] }));
  };

  const handleRemoveSlide = (index: number) => {
    if (config.slides.length <= 1) return;
    setConfig((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, idx) => idx !== index),
    }));
  };

  const handleUploadSlideImage = async (index: number, file: File) => {
    const uploadedOrCompressedUrl = await uploadOrCompressPhoto(file, index);
    if (uploadedOrCompressedUrl) {
      handleSlideFieldUpdate(index, 'imageUrl', uploadedOrCompressedUrl);
    }
  };

  // ============================================================================
  // VIEW 1: GENERATED OUTPUT WEBSITE (When opened via Shared URL or Output Preview)
  // Shows ONLY: Animated Open Letter + Photo Album + Chosen Background Music.
  // ============================================================================
  if (isStandaloneGiftUrl || isPreviewingOutput) {
    const activeTrackTitle =
      MUSIC_TRACKS[config.musicTrack]?.title || 'Background Music';

    return (
      <div className="min-h-screen velvet-maroon-bg text-[#FBF6EE] flex flex-col">
        {/* If sender clicked "Preview Output" inside the generator, show a discreet Return button */}
        {!isStandaloneGiftUrl && isPreviewingOutput && (
          <div className="fixed top-4 left-4 z-50">
            <button
              type="button"
              onClick={() => setIsPreviewingOutput(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#F5E1A4] bg-[#1B0409]/90 border border-[#D4AF37]/45 hover:bg-[#330812] shadow-xl flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
              Back to Website Generator
            </button>
          </div>
        )}

        {/* Pure Generated Output: ONLY the Animated Open Letter and Photo Album */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-14 pb-24">
          {/* 1. Animated Open Letter */}
          <VintageEnvelopeStage
            config={config}
            isOpen={isEnvelopeOpen}
            onToggleOpen={setIsEnvelopeOpen}
            onStartMusicIfClosed={handleStartMusicOnUnseal}
          />

          {/* 2. Photo Album (Read-only—no upload buttons) */}
          <VintagePhotoSlideshow slides={config.slides} />
        </main>

        {/* Chosen Background Music Pill ONLY */}
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 rounded-full border border-[#D4AF37]/45 bg-[#1B0409]/95 backdrop-blur-md px-4 py-2 shadow-2xl">
          <button
            type="button"
            onClick={toggleMusicPlayback}
            aria-label={
              isPlayingMusic ? 'Pause background music' : 'Play background music'
            }
            className="text-xs font-medium text-[#F5E1A4] hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {isPlayingMusic ? (
              <Pause className="w-3.5 h-3.5 text-[#D4AF37]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#D4AF37]" />
            )}
            <span>{activeTrackTitle}</span>
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: THE WEBSITE GENERATOR STUDIO (Where you build & generate the URL)
  // ============================================================================
  return (
    <div className="min-h-screen velvet-maroon-bg text-[#FBF6EE] flex flex-col">
      {/* Strict 3-Zone Top Bar for the Generator Studio */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-[#D4AF37]/25 bg-[#160408]/95 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => e.preventDefault()}
          className="font-serif-editorial text-2xl font-bold tracking-tight gold-foil-text whitespace-nowrap shrink-0"
        >
          Maison d’Amour
        </a>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Generator Sections"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#E8D5B5]/85"
        >
          <button
            type="button"
            onClick={() => setActiveStudioTab('letter')}
            className="hover:text-[#F5E1A4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            1. Write Letter
          </button>
          <button
            type="button"
            onClick={() => setActiveStudioTab('slides')}
            className="hover:text-[#F5E1A4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            2. Photo Album
          </button>
          <button
            type="button"
            onClick={() => setActiveStudioTab('music')}
            className="hover:text-[#F5E1A4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            3. Choose Music
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewingOutput(true)}
            className="hover:text-[#F5E1A4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Preview Generated Output
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleGenerateShareUrl}
            disabled={isSavingShare}
            className="px-4 py-2 text-xs font-semibold text-[#1E0509] bg-gradient-to-r from-[#F5E1A4] via-[#D4AF37] to-[#C59B27] rounded-lg hover:brightness-110 transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            {isSavingShare ? 'Generating...' : 'Generate Shareable Link'}
          </button>
        </div>
      </header>

      {/* Main Generator Studio Workspace */}
      <main className="flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (5 Cols): Generator Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#F5E1A4]/80">
                  Occasion Website Generator · November 01, 2026
                </p>
                <h1 className="font-serif-editorial text-3xl font-semibold text-[#FBF6EE]">
                  Customize Her Gift Page
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewingOutput(true)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-[#F5E1A4] bg-[#2D0910] border border-[#D4AF37]/40 hover:bg-[#3F0D17] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                View Output Only
              </button>
            </div>

            {/* Studio Tabs */}
            <div
              role="tablist"
              aria-label="Studio Customization Sections"
              className="grid grid-cols-4 gap-1 p-1 bg-[#160408] rounded-xl border border-[#D4AF37]/30"
            >
              {[
                { id: 'letter', label: 'Letter', icon: PenTool },
                { id: 'slides', label: 'Album', icon: ImageIcon },
                { id: 'music', label: 'Music', icon: Music },
                { id: 'gemini', label: 'Atelier AI', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeStudioTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setActiveStudioTab(tab.id as StudioTab)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#4B0E1B] text-[#F5E1A4] border border-[#D4AF37]/45'
                        : 'text-[#E8D5B5]/70 hover:text-[#FBF6EE]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {Object.keys(validationErrors).length > 0 && (
              <div
                role="alert"
                className="rounded-xl border border-rose-400/50 bg-rose-950/60 p-4 text-xs text-rose-100 space-y-1"
              >
                {Object.values(validationErrors).map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            {/* TAB 1: LETTER */}
            {activeStudioTab === 'letter' && (
              <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#23060C]/95 p-5 space-y-4">
                <div>
                  <label
                    htmlFor="occasion-preset-select"
                    className="block text-xs font-medium text-[#F5E1A4] mb-1.5"
                  >
                    Occasion Template
                  </label>
                  <select
                    id="occasion-preset-select"
                    value={config.occasionType}
                    onChange={(e) =>
                      handleOccasionChange(e.target.value as OccasionType)
                    }
                    className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2.5 text-sm text-[#FBF6EE]"
                  >
                    {Object.entries(OCCASION_PRESETS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="recipient-name-input"
                      className="block text-xs font-medium text-[#F5E1A4] mb-1"
                    >
                      Girlfriend Name
                    </label>
                    <input
                      id="recipient-name-input"
                      type="text"
                      value={config.recipientName}
                      onChange={(e) => {
                        const nextRecipient = e.target.value;
                        setConfig((prev) => {
                          const prevS =
                            Array.from((prev.senderName || '').trim())[0]?.toUpperCase() || 'J';
                          const prevR =
                            Array.from((prev.recipientName || '').trim())[0]?.toUpperCase() || 'E';
                          const nextR =
                            Array.from(nextRecipient.trim())[0]?.toUpperCase() || 'E';
                          const autoMonogram =
                            !prev.waxMonogram ||
                            prev.waxMonogram === `${prevS}♥${prevR}` ||
                            prev.waxMonogram === 'J♥E'
                              ? `${prevS}♥${nextR}`
                              : prev.waxMonogram;
                          return {
                            ...prev,
                            recipientName: nextRecipient,
                            waxMonogram: autoMonogram,
                          };
                        });
                      }}
                      className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sender-name-input"
                      className="block text-xs font-medium text-[#F5E1A4] mb-1"
                    >
                      Your Signature Name
                    </label>
                    <input
                      id="sender-name-input"
                      type="text"
                      value={config.senderName}
                      onChange={(e) => {
                        const nextSender = e.target.value;
                        setConfig((prev) => {
                          const prevS =
                            Array.from((prev.senderName || '').trim())[0]?.toUpperCase() || 'J';
                          const prevR =
                            Array.from((prev.recipientName || '').trim())[0]?.toUpperCase() || 'E';
                          const nextS =
                            Array.from(nextSender.trim())[0]?.toUpperCase() || 'J';
                          const autoMonogram =
                            !prev.waxMonogram ||
                            prev.waxMonogram === `${prevS}♥${prevR}` ||
                            prev.waxMonogram === 'J♥E'
                              ? `${nextS}♥${prevR}`
                              : prev.waxMonogram;
                          return {
                            ...prev,
                            senderName: nextSender,
                            waxMonogram: autoMonogram,
                          };
                        });
                      }}
                      className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="letter-wax-monogram-input"
                      className="block text-xs font-medium text-[#F5E1A4] mb-1"
                    >
                      Wax Seal (e.g. J♥E)
                    </label>
                    <input
                      id="letter-wax-monogram-input"
                      type="text"
                      maxLength={10}
                      placeholder="e.g. M♥A"
                      value={config.waxMonogram}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          waxMonogram: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE] font-semibold tracking-wider"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="occasion-title-input"
                      className="block text-xs font-medium text-[#F5E1A4] mb-1"
                    >
                      Occasion Title
                    </label>
                    <input
                      id="occasion-title-input"
                      type="text"
                      value={config.occasionTitle}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          occasionTitle: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="occasion-date-input"
                      className="block text-xs font-medium text-[#F5E1A4] mb-1"
                    >
                      Special Date
                    </label>
                    <input
                      id="occasion-date-input"
                      type="date"
                      value={config.occasionDate}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          occasionDate: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="salutation-input"
                    className="block text-xs font-medium text-[#F5E1A4] mb-1"
                  >
                    Calligraphy Salutation
                  </label>
                  <input
                    id="salutation-input"
                    type="text"
                    value={config.salutation}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        salutation: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="letter-body-textarea"
                    className="block text-xs font-medium text-[#F5E1A4] mb-1"
                  >
                    Open Letter Body
                  </label>
                  <textarea
                    id="letter-body-textarea"
                    rows={5}
                    value={config.paragraphs.join('\n\n')}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        paragraphs: e.target.value
                          .split(/\n\s*\n/)
                          .map((p) => p.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2.5 text-sm text-[#FBF6EE] leading-relaxed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pull-quote-input"
                    className="block text-xs font-medium text-[#F5E1A4] mb-1"
                  >
                    Highlight Pull Quote
                  </label>
                  <input
                    id="pull-quote-input"
                    type="text"
                    value={config.pullQuote}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        pullQuote: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="postscript-input"
                    className="block text-xs font-medium text-[#F5E1A4] mb-1"
                  >
                    Postscript (P.S.)
                  </label>
                  <input
                    id="postscript-input"
                    type="text"
                    value={config.postscript}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        postscript: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PHOTO ALBUM SLIDES */}
            {activeStudioTab === 'slides' && (
              <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#23060C]/95 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#F5E1A4]">
                    Photo Album Slides ({config.slides.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E0509] bg-[#D4AF37] hover:bg-[#F5E1A4] transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Photo
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 pt-1">
                  {config.slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="photo-bloom-trigger relative rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37]/65 bg-[#160408] p-3.5 space-y-2.5 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <FlowerBloomOrnament
                              size="sm"
                              className="absolute -top-2.5 -right-2.5 z-20"
                            />
                            <img
                              src={
                                slide.imageUrl ||
                                VINTAGE_ARTWORKS.golden_hour_promenade.dataUri
                              }
                              alt={slide.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-9 rounded object-cover border border-[#D4AF37]/45"
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#F5E1A4]">
                            Photo 0{index + 1}
                          </span>
                        </div>
                        {config.slides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlide(index)}
                            className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) =>
                          handleSlideFieldUpdate(index, 'title', e.target.value)
                        }
                        placeholder="Photo title"
                        className="w-full rounded-lg bg-[#23060C] border border-[#D4AF37]/30 px-2.5 py-1.5 text-xs text-[#FBF6EE]"
                      />

                      <input
                        type="text"
                        value={slide.caption}
                        onChange={(e) =>
                          handleSlideFieldUpdate(index, 'caption', e.target.value)
                        }
                        placeholder="Romantic caption"
                        className="w-full rounded-lg bg-[#23060C] border border-[#D4AF37]/30 px-2.5 py-1.5 text-xs text-[#FBF6EE]"
                      />

                      <div className="flex items-center justify-between gap-2">
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#2D0910] border border-[#D4AF37]/35 text-xs text-[#F5E1A4] hover:bg-[#3F0D17] flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                          Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadSlideImage(index, file);
                            }}
                            className="sr-only"
                          />
                        </label>

                        <select
                          aria-label={`Select preset artwork for photo ${index + 1}`}
                          value={slide.presetKey || ''}
                          onChange={(e) => {
                            const key = e.target.value;
                            if (VINTAGE_ARTWORKS[key]) {
                              setConfig((prev) => {
                                const next = [...prev.slides];
                                next[index] = {
                                  ...next[index],
                                  imageUrl: VINTAGE_ARTWORKS[key].dataUri,
                                  presetKey: key,
                                };
                                return { ...prev, slides: next };
                              });
                            }
                          }}
                          className="rounded-lg bg-[#23060C] border border-[#D4AF37]/30 px-2.5 py-1.5 text-xs text-[#F5E1A4]"
                        >
                          <option value="">Select Vintage Plate...</option>
                          {Object.values(VINTAGE_ARTWORKS).map((art) => (
                            <option key={art.id} value={art.id}>
                              {art.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="url"
                        value={
                          slide.imageUrl.startsWith('data:') ? '' : slide.imageUrl
                        }
                        onChange={(e) =>
                          handleSlideFieldUpdate(index, 'imageUrl', e.target.value)
                        }
                        placeholder="Or paste direct photo URL (e.g. GitHub raw link)"
                        className="w-full rounded-lg bg-[#23060C] border border-[#D4AF37]/25 px-2.5 py-1.5 text-xs text-[#FBF6EE] placeholder:text-[#E8D5B5]/45"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MUSIC & SEAL */}
            {activeStudioTab === 'music' && (
              <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#23060C]/95 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#F5E1A4]">
                    Choose Background Music for Her Link
                  </span>
                  <button
                    type="button"
                    onClick={toggleMusicPlayback}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E0509] bg-[#D4AF37] hover:bg-[#F5E1A4] flex items-center gap-1.5"
                  >
                    {isPlayingMusic ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        Stop Test
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Test Music
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  {Object.values(MUSIC_TRACKS).map((track) => {
                    const selected = config.musicTrack === track.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleSelectTrack(track.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                          selected
                            ? 'bg-[#4B0E1B]/80 border-[#D4AF37] text-[#F5E1A4]'
                            : 'bg-[#160408] border-[#D4AF37]/20 text-[#E8D5B5]'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold">{track.title}</p>
                          <p className="text-[11px] text-[#E8D5B5]/70">
                            {track.subtitle}
                          </p>
                        </div>
                        <Music className="w-4 h-4 text-[#D4AF37]" />
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#F5E1A4] mb-1">
                    Volume
                  </label>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={musicVolume}
                      onChange={(e) =>
                        handleVolumeChange(parseFloat(e.target.value))
                      }
                      aria-label="Music volume"
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="wax-monogram-input"
                    className="block text-xs font-medium text-[#F5E1A4] mb-1"
                  >
                    Gold Wax Seal Monogram
                  </label>
                  <input
                    id="wax-monogram-input"
                    type="text"
                    maxLength={10}
                    value={config.waxMonogram}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        waxMonogram: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/35 px-3.5 py-2 text-sm text-[#FBF6EE]"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: GEMINI POETIC ATELIER */}
            {activeStudioTab === 'gemini' && (
              <GeminiPoeticAtelier
                config={config}
                onApplyGeneratedLetter={(partial) =>
                  setConfig((prev) => ({ ...prev, ...partial }))
                }
              />
            )}
          </div>

          {/* RIGHT COLUMN (7 Cols): Live Preview of the Generated Output (Letter + Album) */}
          <div className="lg:col-span-7 space-y-10">
            <VintageEnvelopeStage
              config={config}
              isOpen={isEnvelopeOpen}
              onToggleOpen={setIsEnvelopeOpen}
              onStartMusicIfClosed={handleStartMusicOnUnseal}
            />

            <VintagePhotoSlideshow slides={config.slides} />
          </div>
        </div>
      </main>

      {/* Share URL Modal */}
      <ShareUrlModal
        isOpen={shareModalOpen}
        shareUrl={generatedShareUrl}
        shortUrl={generatedShortUrl}
        config={config}
        onClose={() => setShareModalOpen(false)}
        onEnterRecipientMode={() => {
          setShareModalOpen(false);
          setIsPreviewingOutput(true);
        }}
      />
    </div>
  );
}

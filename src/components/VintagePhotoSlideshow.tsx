import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Film,
  Grid,
  Heart,
  Maximize2,
  Pause,
  Play,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { PhotoSlide } from '../types/letter';
import { VINTAGE_ARTWORKS } from '../utils/vintageArtworks';
import { musicBox } from '../utils/musicSynthesizer';
import { FlowerBloomOrnament } from './FlowerBloomOrnament';

type AlbumLayoutMode = 'book' | 'cinema' | 'scrapbook';
type VintageFilmFilter = 'warm' | 'sepia' | 'rose' | 'noir';

interface VintagePhotoSlideshowProps {
  slides: PhotoSlide[];
  onUploadPhotoToCurrentSlide?: (slideIndex: number, dataUrl: string) => void;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const FILM_FILTERS: Record<VintageFilmFilter, { label: string; css: string }> = {
  warm: {
    label: 'Warm Gold',
    css: 'contrast-105 saturate-105',
  },
  sepia: {
    label: '1920s Sepia',
    css: 'sepia-[.55] contrast-105 brightness-95',
  },
  rose: {
    label: 'Velvet Rose',
    css: 'hue-rotate-[-12deg] saturate-110 contrast-105',
  },
  noir: {
    label: 'Classic Noir',
    css: 'grayscale contrast-125 brightness-95',
  },
};

export const VintagePhotoSlideshow: React.FC<VintagePhotoSlideshowProps> = ({
  slides,
  onUploadPhotoToCurrentSlide,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layoutMode, setLayoutMode] = useState<AlbumLayoutMode>('book');
  const [filmFilter, setFilmFilter] = useState<VintageFilmFilter>('warm');
  const [autoPlay, setAutoPlay] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [flipCycle, setFlipCycle] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const safeSlides = slides.length > 0 ? slides : [];
  const activeIndex = safeSlides.length > 0 ? currentIndex % safeSlides.length : 0;
  const activeSlide = safeSlides[activeIndex];

  useEffect(() => {
    if (!autoPlay || safeSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      musicBox.playPageTurnSound('next');
      setFlipDirection('next');
      setFlipCycle((c) => c + 1);
      setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [autoPlay, safeSlides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight' && lightboxOpen && safeSlides.length > 1) {
        musicBox.playPageTurnSound('next');
        setFlipDirection('next');
        setFlipCycle((c) => c + 1);
        setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
      } else if (e.key === 'ArrowLeft' && lightboxOpen && safeSlides.length > 1) {
        musicBox.playPageTurnSound('prev');
        setFlipDirection('prev');
        setFlipCycle((c) => c + 1);
        setCurrentIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, safeSlides.length]);

  if (!activeSlide) {
    return null;
  }

  const handleSelectPage = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;
    const dir = nextIndex > activeIndex ? 'next' : 'prev';
    musicBox.playPageTurnSound(dir);
    setFlipDirection(dir);
    setFlipCycle((c) => c + 1);
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    musicBox.playPageTurnSound('prev');
    setFlipDirection('prev');
    setFlipCycle((c) => c + 1);
    setCurrentIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  };

  const handleNext = () => {
    musicBox.playPageTurnSound('next');
    setFlipDirection('next');
    setFlipCycle((c) => c + 1);
    setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadPhotoToCurrentSlide) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadPhotoToCurrentSlide(activeIndex, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const fallbackSvg = VINTAGE_ARTWORKS.golden_hour_promenade.dataUri;
  const resolveImage = (slide: PhotoSlide) =>
    imgErrors[slide.id] ? fallbackSvg : slide.imageUrl || fallbackSvg;
  const resolvedSrc = resolveImage(activeSlide);
  const filterClass = FILM_FILTERS[filmFilter].css;
  const romanChapter =
    ROMAN_NUMERALS[activeIndex] || String(activeIndex + 1);

  return (
    <section
      aria-label="Photo Album"
      className="w-full max-w-4xl mx-auto"
    >
      {/* Top Album Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
        <div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#F5E1A4]">
            Our Photo Album
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Mode Switcher: Book Spread | Cinema Slide | Scrapbook Grid */}
          <div
            role="tablist"
            aria-label="Photo Album View Modes"
            className="flex items-center gap-1 p-1 bg-[#1A0408] border border-[#D4AF37]/30 rounded-xl"
          >
            <button
              role="tab"
              aria-selected={layoutMode === 'book'}
              type="button"
              onClick={() => setLayoutMode('book')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                layoutMode === 'book'
                  ? 'bg-[#4B0E1B] text-[#F5E1A4] border border-[#D4AF37]/40'
                  : 'text-[#E8D5B5]/70 hover:text-[#FBF6EE]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              Book
            </button>
            <button
              role="tab"
              aria-selected={layoutMode === 'cinema'}
              type="button"
              onClick={() => setLayoutMode('cinema')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                layoutMode === 'cinema'
                  ? 'bg-[#4B0E1B] text-[#F5E1A4] border border-[#D4AF37]/40'
                  : 'text-[#E8D5B5]/70 hover:text-[#FBF6EE]'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
              Slide
            </button>
            <button
              role="tab"
              aria-selected={layoutMode === 'scrapbook'}
              type="button"
              onClick={() => setLayoutMode('scrapbook')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                layoutMode === 'scrapbook'
                  ? 'bg-[#4B0E1B] text-[#F5E1A4] border border-[#D4AF37]/40'
                  : 'text-[#E8D5B5]/70 hover:text-[#FBF6EE]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#D4AF37]" />
              Scrapbook
            </button>
          </div>

          {/* Vintage Film Tone Selector */}
          <button
            type="button"
            onClick={() => {
              const order: VintageFilmFilter[] = ['warm', 'sepia', 'rose', 'noir'];
              const next = order[(order.indexOf(filmFilter) + 1) % order.length];
              setFilmFilter(next);
            }}
            aria-label={`Film tone: ${FILM_FILTERS[filmFilter].label}`}
            className="px-3 py-1.5 text-xs font-medium text-[#F5E1A4] bg-[#2D0910] border border-[#D4AF37]/35 rounded-xl hover:bg-[#3F0D17] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {FILM_FILTERS[filmFilter].label}
          </button>

          {/* Auto-Play Toggle */}
          {layoutMode !== 'scrapbook' && (
            <button
              type="button"
              onClick={() => setAutoPlay((prev) => !prev)}
              className="px-3 py-1.5 text-xs font-medium text-[#F5E1A4] bg-[#2D0910] border border-[#D4AF37]/35 rounded-xl hover:bg-[#3F0D17] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              {autoPlay ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Auto-Turn
                </>
              )}
            </button>
          )}

          {onUploadPhotoToCurrentSlide && (
            <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-[#F5E1A4] bg-[#2D0910] border border-[#D4AF37]/35 rounded-xl hover:bg-[#3F0D17] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
              Add Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload custom photo for current slide"
              />
            </label>
          )}
        </div>
      </div>

      {/* =====================================================================
          MODE 1: OPEN HEIRLOOM BOOK SPREAD (LEFT PHOTO PAGE + RIGHT STORY PAGE)
      ===================================================================== */}
      {layoutMode === 'book' && (
        <div className="album-leather-cover relative rounded-2xl p-3 sm:p-6 border border-[#D4AF37]/50">
          {/* Crimson & Gold Silk Bookmark Ribbon at Top Spine */}
          <div
            aria-hidden="true"
            className="hidden md:block pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 z-30 w-5 h-10 bg-gradient-to-b from-[#8B1E32] to-[#520E1B] border-x border-[#D4AF37]/60 shadow-md"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
            }}
          />

          {/* Open Two-Page Parchment Spread */}
          <div
            key={`book-spread-${flipCycle}`}
            className={`relative rounded-xl parchment-surface border-2 border-[#D4AF37]/65 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[430px] ${
              flipDirection === 'next'
                ? 'animate-page-flip-next'
                : 'animate-page-flip-prev'
            }`}
          >
            {/* Center Book Spine Shadow on Desktop */}
            <div
              aria-hidden="true"
              className="hidden md:block pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 album-book-spine z-20"
            />

            {/* LEFT PAGE: Mounted Photograph with Gold Corner Brackets */}
            <div className="relative p-5 sm:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#8B1E32]/15">
              {/* Photo Mounting Frame with Gold Corners */}
              <div className="photo-bloom-trigger relative p-2.5 sm:p-3.5 bg-[#FFFDF9] rounded-lg shadow-[0_10px_28px_rgba(42,15,20,0.22)] border border-[#8B1E32]/20 transition-shadow duration-500 hover:shadow-[0_14px_34px_rgba(184,41,67,0.28)]">
                {/* Diagonal Pair of Romantic Flower Bloom Ornaments on Hover */}
                <FlowerBloomOrnament
                  size="md"
                  className="absolute -top-4 -right-4 z-30"
                />
                <FlowerBloomOrnament
                  size="sm"
                  mirror
                  className="absolute -bottom-3.5 -left-3.5 z-30"
                />

                {/* 4 Ornate Gold Photo-Corner Brackets */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-[#B8860B] z-10"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-[#B8860B] z-10"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-[#B8860B] z-10"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-[#B8860B] z-10"
                />

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-[#160408] group">
                  <img
                    src={resolvedSrc}
                    alt={`${activeSlide.title} — ${activeSlide.caption}`}
                    referrerPolicy="no-referrer"
                    onClick={() => setLightboxOpen(true)}
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [activeSlide.id]: true }))
                    }
                    className={`w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105 ${filterClass}`}
                  />

                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    aria-label="Enlarge photograph in lightbox"
                    className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-black/65 border border-[#D4AF37]/50 text-[#F5E1A4] opacity-85 hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Handwritten Under-Photo Plate Note */}
                <div className="mt-2.5 flex items-center justify-between text-xs text-[#5E1120]/80 font-serif-editorial italic px-1">
                  <span>{activeSlide.memoryDate}</span>
                  {activeSlide.location && <span>{activeSlide.location}</span>}
                </div>
              </div>
            </div>

            {/* RIGHT PAGE: Handwritten Story & Page-Turn Controls */}
            <div className="relative p-6 sm:p-8 flex flex-col justify-between">
              {/* Top Chapter Numeral & Date */}
              <div>
                <div className="flex items-center justify-between border-b border-[#8B1E32]/20 pb-3 mb-5">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#6E1727] font-semibold">
                    Memory {romanChapter} of {ROMAN_NUMERALS[safeSlides.length - 1] || safeSlides.length}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-[#8B1E32] fill-[#8B1E32]/20" />
                </div>

                <h3
                  className="font-calligraphy text-3xl sm:text-4xl text-[#6E1727] mb-3 py-0.5"
                  style={{ textWrap: 'balance' }}
                >
                  {activeSlide.title}
                </h3>

                <p className="font-serif-editorial italic text-lg sm:text-xl leading-relaxed text-[#2A0F14]">
                  “{activeSlide.caption}”
                </p>
              </div>

              {/* Bottom Page Flip Navigation */}
              <div className="mt-8 pt-4 border-t border-[#8B1E32]/20 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Turn to previous album page"
                  className="px-3 py-1.5 rounded-lg border border-[#8B1E32]/30 text-xs font-medium text-[#5E1120] hover:bg-[#8B1E32]/10 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev Page
                </button>

                <span className="font-serif-editorial text-xs text-[#6E1727] tabular-nums whitespace-nowrap shrink-0">
                  Page {activeIndex + 1} / {safeSlides.length}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Turn to next album page"
                  className="px-3 py-1.5 rounded-lg bg-[#6E1727] text-xs font-medium text-[#FBF6EE] hover:bg-[#52101C] transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 shadow-xs"
                >
                  Next Page
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Thumbnail Filmstrip Ribbon */}
          <div
            role="tablist"
            aria-label="Photo Album Pages"
            className="grid grid-cols-4 sm:grid-cols-4 gap-3 mt-4"
          >
            {safeSlides.map((slide, index) => {
              const isSelected = index === activeIndex;
              const thumbSrc = resolveImage(slide);
              return (
                <button
                  key={slide.id}
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Open Page ${index + 1}: ${slide.title}`}
                  type="button"
                  onClick={() => handleSelectPage(index)}
                  className={`photo-bloom-trigger group relative rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/45 scale-[1.01]'
                      : 'border-[#D4AF37]/25 opacity-75 hover:opacity-100'
                  }`}
                >
                  <FlowerBloomOrnament
                    size="sm"
                    className="absolute -top-2.5 -right-2.5 z-20"
                  />
                  <div className="overflow-hidden rounded-xl">
                    <div className="aspect-[16/10] w-full bg-[#160408]">
                      <img
                        src={thumbSrc}
                        alt={slide.title}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${filterClass}`}
                      />
                    </div>
                    <div className="px-2.5 py-1.5 bg-[#190307] flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#F5E1A4] truncate">
                        {slide.title}
                      </span>
                      <span className="text-[10px] text-[#E8D5B5]/60 tabular-nums ml-1 shrink-0">
                        0{index + 1}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 2: CINEMA KEN BURNS SLIDESHOW VIEW
      ===================================================================== */}
      {layoutMode === 'cinema' && (
        <div className="album-leather-cover relative rounded-2xl p-4 sm:p-6 border border-[#D4AF37]/50">
          <div className="photo-bloom-trigger relative w-full">
            <FlowerBloomOrnament
              size="lg"
              className="absolute -top-4 -right-4 z-30"
            />
            <FlowerBloomOrnament
              size="md"
              mirror
              className="absolute -bottom-4 -left-4 z-30"
            />
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[#D4AF37]/45 bg-[#160408]">
              <img
                key={`cinema-${activeSlide.id}`}
                src={resolvedSrc}
                alt={`${activeSlide.title} — ${activeSlide.caption}`}
                referrerPolicy="no-referrer"
                onClick={() => setLightboxOpen(true)}
                onError={() =>
                  setImgErrors((prev) => ({ ...prev, [activeSlide.id]: true }))
                }
                className={`w-full h-full object-cover animate-ken-burns cursor-pointer ${filterClass}`}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/65 border border-[#D4AF37]/50 text-[#F5E1A4] hover:bg-[#3D0A14] transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/65 border border-[#D4AF37]/50 text-[#F5E1A4] hover:bg-[#3D0A14] transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F5E1A4]/85 mb-1">
                  {activeSlide.memoryDate}
                  {activeSlide.location ? ` · ${activeSlide.location}` : ''}
                </p>
                <h3 className="font-calligraphy text-3xl sm:text-5xl text-[#F5E1A4]">
                  {activeSlide.title}
                </h3>
                <p className="font-serif-editorial italic text-base sm:text-lg text-[#FBF6EE]/95 mt-1 max-w-xl mx-auto">
                  “{activeSlide.caption}”
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 3: SCRAPBOOK POLAROID GALLERY GRID
      ===================================================================== */}
      {layoutMode === 'scrapbook' && (
        <div className="album-leather-cover rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {safeSlides.map((slide, index) => {
              const rotationClass =
                index % 2 === 0 ? 'sm:-rotate-1' : 'sm:rotate-1';
              const src = resolveImage(slide);
              return (
                <div
                  key={slide.id}
                  onClick={() => {
                    musicBox.playPageTurnSound(index >= activeIndex ? 'next' : 'prev');
                    setCurrentIndex(index);
                    setLightboxOpen(true);
                  }}
                  className={`photo-bloom-trigger relative group cursor-pointer rounded-xl parchment-surface p-4 pb-6 shadow-[0_16px_40px_rgba(0,0,0,0.65)] border border-[#D4AF37]/60 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] ${rotationClass}`}
                >
                  <FlowerBloomOrnament
                    size="md"
                    className="absolute -top-3.5 -right-3.5 z-20"
                  />
                  <FlowerBloomOrnament
                    size="sm"
                    mirror
                    className="absolute -bottom-3 -left-3 z-20"
                  />

                  {/* Gold Brass Pin at Top Center */}
                  <div className="flex justify-center -mt-2 mb-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFF2C2] via-[#D4AF37] to-[#8C6210] shadow-md border border-[#380A14]/40" />
                  </div>

                  <div className="aspect-[4/3] w-full overflow-hidden rounded bg-[#160408] border border-[#8B1E32]/20">
                    <img
                      src={src}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${filterClass}`}
                    />
                  </div>

                  <div className="mt-4 text-center px-2">
                    <p className="text-[11px] uppercase tracking-widest text-[#6E1727]/80">
                      {slide.memoryDate}
                    </p>
                    <h3 className="font-calligraphy text-3xl text-[#6E1727] mt-0.5">
                      {slide.title}
                    </h3>
                    <p className="font-serif-editorial italic text-sm text-[#2A0F14]/90 mt-1">
                      “{slide.caption}”
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Full resolution view of ${activeSlide.title}`}
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4 sm:p-8"
        >
          <div className="relative max-w-4xl w-full bg-[#1D050A] border border-[#D4AF37]/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/25">
              <div>
                <h4 className="font-serif-editorial text-xl text-[#F5E1A4]">
                  {activeSlide.title}
                </h4>
                <p className="text-xs text-[#E8D5B5]/75">
                  {activeSlide.memoryDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close photo lightbox"
                className="w-9 h-9 rounded-lg bg-[#2D0910] border border-[#D4AF37]/40 text-[#F5E1A4] hover:bg-[#460E19] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-[4/3] max-h-[70vh] w-full bg-black flex items-center justify-center">
              <img
                src={resolvedSrc}
                alt={activeSlide.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain ${filterClass}`}
              />
            </div>
            <div className="px-6 py-4 border-t border-[#D4AF37]/25 flex items-center justify-between gap-4">
              <p className="font-serif-editorial italic text-base text-[#FBF6EE]">
                “{activeSlide.caption}”
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo in lightbox"
                  className="px-3 py-1.5 rounded-lg bg-[#2D0910] border border-[#D4AF37]/35 text-xs text-[#F5E1A4]"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photo in lightbox"
                  className="px-3 py-1.5 rounded-lg bg-[#2D0910] border border-[#D4AF37]/35 text-xs text-[#F5E1A4]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

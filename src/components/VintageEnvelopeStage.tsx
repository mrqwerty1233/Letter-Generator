import React, { useState, useEffect, useRef } from 'react';
import { LockOpen, Play, RotateCcw } from 'lucide-react';
import { LetterConfig } from '../types/letter';
import { formatEditorialDate, getWaxSealMonogram } from '../utils/letterCodec';
import { musicBox } from '../utils/musicSynthesizer';

export type EnvelopeAnimStage =
  | 'sealed'
  | 'cracking'
  | 'flap_opening'
  | 'rising'
  | 'unfolded';

interface VintageEnvelopeStageProps {
  config: LetterConfig;
  isOpen: boolean;
  onToggleOpen: (nextOpen: boolean) => void;
  onStartMusicIfClosed?: () => void;
}

interface GoldCanvasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
  shape: 'heart' | 'star' | 'flake' | 'orb';
}

const GOLD_PALETTE = [
  '#FFF8DC', // Cornsilk highlight
  '#F5E1A4', // Champagne gold
  '#E5C158', // Bright antique gold
  '#D4AF37', // Classic metallic gold
  '#C59B27', // Warm burnished gold
];

const HEART_PALETTE = [
  '#FF6B8B', // Romantic blush rose
  '#E03E5C', // Velvet crimson heart
  '#FFB3C6', // Soft pink petal
  '#F5E1A4', // Antique gold heart
  '#A81C37', // Wine ruby heart
];

function drawFourPointStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number,
  rotation: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const outerAngle = (i * Math.PI) / 2;
    const innerAngle = outerAngle + Math.PI / 4;
    const ox = Math.cos(outerAngle) * outerRadius;
    const oy = Math.sin(outerAngle) * outerRadius;
    const ix = Math.cos(innerAngle) * innerRadius;
    const iy = Math.sin(innerAngle) * innerRadius;
    if (i === 0) {
      ctx.moveTo(ox, oy);
    } else {
      ctx.lineTo(ox, oy);
    }
    ctx.lineTo(ix, iy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHeartParticle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const s = size * 0.11;
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(0, 1, -5, -5, -10, -5);
  ctx.bezierCurveTo(-16, -5, -16, 3.5, -16, 3.5);
  ctx.bezierCurveTo(-16, 9, -9, 15.4, 0, 21);
  ctx.bezierCurveTo(9, 15.4, 16, 9, 16, 3.5);
  ctx.bezierCurveTo(16, 3.5, 16, -5, 10, -5);
  ctx.bezierCurveTo(5, -5, 0, 1, 0, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 245, 214, 0.65)';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
}

/**
 * Generates a burst of small heart-shaped particles and golden sparkles
 * radiating from the Open Letter wax seal button.
 */
export function createHeartAndSparkleBurst(
  originX: number,
  originY: number
): GoldCanvasParticle[] {
  const heartCount = 46;
  const sparkleCount = 42;

  const hearts: GoldCanvasParticle[] = Array.from(
    { length: heartCount },
    (_, idx) => {
      // Fan upward and outward in a romantic fountain + radial burst
      const angle =
        (idx / heartCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const speed = 2.0 + Math.random() * 5.8;
      return {
        x: originX + (Math.random() - 0.5) * 20,
        y: originY + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (2.1 + Math.random() * 2.4),
        size: 5.5 + Math.random() * 6.5,
        alpha: 0.96 + Math.random() * 0.04,
        decay: 0.0085 + Math.random() * 0.008,
        rotation: (Math.random() - 0.5) * 0.65,
        rotationSpeed: (Math.random() - 0.5) * 0.045,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.12 + Math.random() * 0.12,
        color: HEART_PALETTE[idx % HEART_PALETTE.length],
        shape: 'heart',
      };
    }
  );

  const sparkles: GoldCanvasParticle[] = Array.from(
    { length: sparkleCount },
    (_, idx) => {
      const angle =
        (idx / sparkleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const speed = 2.4 + Math.random() * 6.6;
      const shapes: Array<'star' | 'flake' | 'orb'> = ['star', 'flake', 'orb'];
      return {
        x: originX + (Math.random() - 0.5) * 18,
        y: originY + (Math.random() - 0.5) * 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1.4 + Math.random() * 2.0),
        size: 3.8 + Math.random() * 6.2,
        alpha: 0.95 + Math.random() * 0.05,
        decay: 0.0095 + Math.random() * 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.14,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.16 + Math.random() * 0.18,
        color: GOLD_PALETTE[idx % GOLD_PALETTE.length],
        shape: shapes[idx % shapes.length],
      };
    }
  );

  return [...hearts, ...sparkles];
}

export const VintageEnvelopeStage: React.FC<VintageEnvelopeStageProps> = ({
  config,
  isOpen,
  onToggleOpen,
  onStartMusicIfClosed,
}) => {
  const [animStage, setAnimStage] = useState<EnvelopeAnimStage>(
    isOpen ? 'unfolded' : 'sealed'
  );
  const [unfoldCycle, setUnfoldCycle] = useState(0);
  const [sparkleBurstId, setSparkleBurstId] = useState(0);
  const timersRef = useRef<number[]>([]);
  const envelopeBoxRef = useRef<HTMLDivElement | null>(null);
  const sealButtonRef = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const clearStageTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearStageTimers();
  }, []);

  useEffect(() => {
    if (isOpen && animStage === 'sealed') {
      setAnimStage('unfolded');
    } else if (!isOpen && animStage === 'unfolded') {
      setAnimStage('sealed');
    }
  }, [isOpen, animStage]);

  // Triggers a burst of small heart-shaped particles & gold sparkles when 'Open Letter' is clicked
  const triggerHeartParticleBurst = () => {
    setSparkleBurstId((id) => id + 1);
  };

  useEffect(() => {
    if (sparkleBurstId === 0) return;
    const canvas = canvasRef.current;
    const container = envelopeBoxRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Determine exact origin of the Open Letter wax seal relative to the envelope container
    let originX = rect.width / 2;
    let originY = Math.min(rect.height * 0.68, 290);
    if (sealButtonRef.current) {
      const sealRect = sealButtonRef.current.getBoundingClientRect();
      if (sealRect.width > 0 && sealRect.height > 0) {
        originX = sealRect.left - rect.left + sealRect.width / 2;
        originY = sealRect.top - rect.top + sealRect.height / 2 - 10;
      }
    }

    const particles = createHeartAndSparkleBurst(originX, originY);

    let rafId = 0;
    const renderFrame = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      let aliveCount = 0;

      for (const p of particles) {
        if (p.alpha <= 0.01) continue;
        aliveCount++;

        // Physics update: drag + gentle flutter for hearts + soft gravity
        p.x += p.vx + (p.shape === 'heart' ? Math.sin(p.twinklePhase) * 0.45 : 0);
        p.y += p.vy;
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 + (p.shape === 'heart' ? 0.045 : 0.07);
        p.rotation += p.rotationSpeed;
        p.twinklePhase += p.twinkleSpeed;
        p.alpha -= p.decay;

        const twinkle =
          p.shape === 'heart'
            ? 0.82 + 0.18 * Math.sin(p.twinklePhase)
            : 0.65 + 0.35 * Math.sin(p.twinklePhase);
        const currentAlpha = Math.max(0, p.alpha * twinkle);

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.shape === 'heart' ? '#FF6B8B' : '#F5E1A4';
        ctx.shadowBlur = p.shape === 'heart' ? 10 : p.shape === 'star' ? 12 : 7;

        if (p.shape === 'heart') {
          drawHeartParticle(ctx, p.x, p.y, p.size, p.rotation);
        } else if (p.shape === 'star') {
          drawFourPointStar(
            ctx,
            p.x,
            p.y,
            p.size * 1.4,
            p.size * 0.34,
            p.rotation
          );
        } else if (p.shape === 'flake') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(Math.max(0.25, Math.abs(Math.cos(p.twinklePhase))), 1);
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.85);
          ctx.lineTo(p.size * 0.65, 0);
          ctx.lineTo(0, p.size * 0.85);
          ctx.lineTo(-p.size * 0.65, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (aliveCount > 0) {
        rafId = window.requestAnimationFrame(renderFrame);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [sparkleBurstId]);

  const monogram = getWaxSealMonogram(
    config.senderName,
    config.recipientName,
    config.waxMonogram
  );
  const formattedDate = formatEditorialDate(config.occasionDate);

  const runOpeningChoreography = () => {
    clearStageTimers();
    musicBox.playWaxSealUnfoldChime();
    if (onStartMusicIfClosed) {
      onStartMusicIfClosed();
    }

    // Phase 1: Wax seal fractures & heart-shaped particles + gold sparkles burst outward
    setAnimStage('cracking');
    triggerHeartParticleBurst();

    // Phase 2: 3D Maroon top flap hinges open 180 degrees
    const t1 = window.setTimeout(() => {
      setAnimStage('flap_opening');
    }, 360);

    // Phase 3: Folded cotton parchment rises out of the velvet pocket
    const t2 = window.setTimeout(() => {
      setAnimStage('rising');
    }, 860);

    // Phase 4: Parchment unfolds in 3D with staggered paragraph entrance
    const t3 = window.setTimeout(() => {
      setUnfoldCycle((c) => c + 1);
      setAnimStage('unfolded');
      onToggleOpen(true);
    }, 1460);

    timersRef.current = [t1, t2, t3];
  };

  const handleFoldBack = () => {
    clearStageTimers();
    setAnimStage('sealed');
    onToggleOpen(false);
  };

  const isTransitioning =
    animStage === 'cracking' ||
    animStage === 'flap_opening' ||
    animStage === 'rising';

  return (
    <section
      ref={envelopeBoxRef}
      aria-label="Animated Love Letter"
      data-envelope-stage={animStage}
      className="relative w-full max-w-3xl mx-auto"
    >
      {/* OVERLAID GOLD SPARKLE CANVAS LAYER (Triggers once when wax seal cracks) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-testid="gold-sparkle-canvas"
        className="pointer-events-none absolute inset-0 w-full h-full z-40"
      />

      {/* STAGE A: 3D INTERACTIVE ENVELOPE (SEALED -> CRACKING -> FLAP OPENING -> RISING) */}
      {animStage !== 'unfolded' ? (
        <div
          style={{
            paddingTop:
              animStage === 'flap_opening' || animStage === 'rising'
                ? '136px'
                : '8px',
            transition: 'padding-top 480ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="perspective-envelope relative pb-2"
        >
          <div className="relative rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-b from-[#4B0E1B] via-[#380A14] to-[#22050B] p-6 sm:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-visible transition-all duration-300">
            {/* Outer & Inner Gold Filigree Borders */}
            <div className="pointer-events-none absolute inset-3 border border-[#D4AF37]/25 rounded-xl z-20" />
            <div className="pointer-events-none absolute inset-5 border border-[#D4AF37]/15 rounded-lg z-20" />

            {/* Dark Velvet Interior Pocket Cavity */}
            <div className="pointer-events-none absolute inset-x-4 top-3 h-36 rounded-t-xl bg-gradient-to-b from-[#130205] via-[#1F040A] to-[#2D0710] border-b border-[#D4AF37]/25 opacity-95 z-0" />

            {/* RISING FOLDED PARCHMENT SHEET SLIDING OUT OF THE ENVELOPE POCKET */}
            <div
              aria-hidden="true"
              style={{
                transform:
                  animStage === 'rising'
                    ? 'translateY(-54px) scale(1.01)'
                    : animStage === 'flap_opening'
                    ? 'translateY(-8px) scale(0.96)'
                    : 'translateY(28px) scale(0.9)',
                opacity:
                  animStage === 'flap_opening' || animStage === 'rising' ? 1 : 0,
                transition:
                  'transform 540ms cubic-bezier(0.22, 1, 0.36, 1), opacity 340ms ease-out',
              }}
              className="pointer-events-none relative z-10 mx-auto max-w-lg rounded-xl border-2 border-[#D4AF37]/65 parchment-surface px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center justify-between border-b border-[#8B1E32]/25 pb-2 mb-2">
                <span className="text-[11px] uppercase tracking-widest text-[#6E1727] font-semibold">
                  {formattedDate}
                </span>
              </div>
              <p className="font-calligraphy text-2xl sm:text-3xl text-[#6E1727]">
                {config.salutation || `My Dearest ${config.recipientName},`}
              </p>
              <p className="font-serif-editorial text-sm text-[#2A0F14]/85 line-clamp-2 mt-1">
                {config.paragraphs[0]}
              </p>
              <div className="mt-3 h-2 w-full parchment-fold-crease rounded-full" />
            </div>

            {/* 3D HINGED TOP ENVELOPE FLAP */}
            <div
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                transform:
                  animStage === 'flap_opening' || animStage === 'rising'
                    ? 'rotateX(176deg)'
                    : animStage === 'cracking'
                    ? 'rotateX(18deg)'
                    : 'rotateX(0deg)',
                transition: 'transform 540ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className={`pointer-events-none absolute inset-x-0 top-0 h-32 ${
                animStage === 'rising' ? 'z-0' : 'z-20'
              }`}
            >
              <svg
                className="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.55)]"
                viewBox="0 0 600 180"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="maroonFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#581120" />
                    <stop offset="60%" stopColor="#3F0B16" />
                    <stop offset="100%" stopColor="#2B070E" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,0 L 300,168 L 600,0 Z"
                  fill="url(#maroonFlapGrad)"
                  stroke="#D4AF37"
                  strokeWidth="2"
                  strokeOpacity="0.65"
                />
                <path
                  d="M 22,4 L 300,154 L 578,4"
                  fill="none"
                  stroke="#F5E1A4"
                  strokeWidth="0.9"
                  strokeDasharray="5 5"
                  strokeOpacity="0.45"
                />
              </svg>
            </div>

            {/* ENVELOPE FRONT POCKET & CALLIGRAPHY INSCRIPTION */}
            <div className="relative z-20 flex flex-col items-center text-center pt-2 pb-2">
              <p className="text-xs tracking-[0.2em] uppercase text-[#F5E1A4]/80 mb-2 tabular-nums">
                {formattedDate}
              </p>

              <h1
                className="font-calligraphy text-4xl sm:text-6xl text-[#F5E1A4] mb-2 py-1"
                style={{ textWrap: 'balance' }}
              >
                For My Dearest {config.recipientName || 'Love'}
              </h1>

              <p className="font-serif-editorial italic text-lg sm:text-xl text-[#FBF6EE]/90 max-w-md mb-6">
                {config.occasionTitle}
              </p>

              {/* INTERACTIVE 3D GOLD WAX SEAL */}
              <div className="relative flex flex-col items-center">
                <button
                  ref={sealButtonRef}
                  type="button"
                  disabled={isTransitioning}
                  onClick={runOpeningChoreography}
                  aria-label="Break the Gold Wax Seal to Open the Vintage Letter"
                  style={{
                    opacity:
                      animStage === 'flap_opening' || animStage === 'rising' ? 0 : 1,
                    transform:
                      animStage === 'flap_opening' || animStage === 'rising'
                        ? 'scale(0.72) translateY(18px)'
                        : undefined,
                    transition: 'opacity 320ms ease, transform 320ms ease',
                  }}
                  className={`group relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5E1A4] rounded-full cursor-pointer ${
                    animStage === 'cracking' ? 'animate-wax-crack' : ''
                  }`}
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#FFF0B8] via-[#D4AF37] to-[#8C6210] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-200 flex items-center justify-center animate-float-slow">
                    <div className="w-full h-full rounded-full border-2 border-dashed border-[#4A121B]/60 bg-gradient-to-br from-[#E5C158] via-[#C59B27] to-[#9A6F18] flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                      <span className="font-serif-editorial font-bold text-xl sm:text-2xl tracking-wider text-[#330810] drop-shadow-xs">
                        {monogram}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#330810]/80 font-semibold mt-0.5">
                        Open
                      </span>

                      {animStage === 'cracking' && (
                        <svg
                          viewBox="0 0 100 100"
                          className="absolute inset-0 w-full h-full stroke-[#FFF8DC] stroke-2 fill-none"
                        >
                          <polyline points="48,0 54,28 43,52 57,74 49,100" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <span className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#F5E1A4]/90 group-hover:text-[#F5E1A4]">
                    <LockOpen className="w-3.5 h-3.5" />
                    {isTransitioning ? 'Opening Letter...' : 'Tap Seal to Open Letter'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STAGE B: UNFOLDED VINTAGE COTTON RAG PARCHMENT LETTER */
        <article
          key={`unfolded-parchment-${unfoldCycle}`}
          aria-label={`Open letter to ${config.recipientName}`}
          className="animate-parchment-unfold relative rounded-2xl border-2 border-[#D4AF37]/60 parchment-surface p-6 sm:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.75)] overflow-hidden"
        >
          {/* Decorative Inner Gold Hairline Frame */}
          <div className="pointer-events-none absolute inset-3 sm:inset-4 border border-[#8B1E32]/25 rounded-xl" />

          {/* Subtle Horizontal Paper Unfold Crease Lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-1/3 h-px bg-gradient-to-r from-transparent via-[#8B1E32]/15 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-2/3 h-px bg-gradient-to-r from-transparent via-[#8B1E32]/15 to-transparent"
          />

          {/* Letter Header */}
          <header className="relative z-10 border-b border-[#8B1E32]/20 pb-5 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#6E1727] font-medium tabular-nums">
                {formattedDate}
              </p>
              <h1
                className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#380A14] mt-0.5"
                style={{ textWrap: 'balance' }}
              >
                {config.occasionTitle}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={runOpeningChoreography}
                aria-label="Replay letter opening animation"
                className="px-3 py-1.5 text-xs font-medium text-[#6E1727] border border-[#8B1E32]/30 rounded-lg hover:bg-[#8B1E32]/10 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Play className="w-3 h-3" />
                Replay
              </button>
              <button
                type="button"
                onClick={handleFoldBack}
                aria-label="Fold letter back into envelope"
                className="px-3 py-1.5 text-xs font-medium text-[#6E1727] border border-[#8B1E32]/30 rounded-lg hover:bg-[#8B1E32]/10 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                Seal Envelope
              </button>
            </div>
          </header>

          {/* Salutation in Gold-Accented Calligraphy */}
          <div className="relative z-10 mb-6">
            <p className="font-calligraphy text-3xl sm:text-4xl text-[#6E1727]">
              {config.salutation || `My Dearest ${config.recipientName},`}
            </p>
          </div>

          {/* Letter Prose Body */}
          <div className="relative z-10 max-w-2xl space-y-5 font-serif-editorial text-lg sm:text-xl leading-relaxed text-[#2A0F14]">
            {(config.paragraphs || []).map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? 'first-letter:text-5xl first-letter:font-bold first-letter:text-[#6E1727] first-letter:float-left first-letter:mr-3 first-letter:leading-none'
                    : ''
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Pull Quote */}
          {config.pullQuote && (
            <blockquote className="relative z-10 my-8 py-5 border-y border-[#8B1E32]/25 text-center max-w-xl mx-auto">
              <p
                className="font-serif-editorial italic text-xl sm:text-2xl text-[#5E1120]"
                style={{ textWrap: 'balance' }}
              >
                “{config.pullQuote}”
              </p>
            </blockquote>
          )}

          {/* Sign-off & Calligraphy Signature */}
          <footer className="relative z-10 mt-8 pt-6 border-t border-[#8B1E32]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5E1A4] via-[#D4AF37] to-[#9A6F18] p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full border border-dashed border-[#4A121B]/50 flex items-center justify-center">
                  <span className="font-serif-editorial font-bold text-xs text-[#380A14]">
                    {monogram}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-serif-editorial italic text-lg text-[#4A121B]">
                  {config.signOff || 'Forever & Always Yours,'}
                </p>
                <p className="font-calligraphy text-4xl sm:text-5xl text-[#6E1727] mt-0.5">
                  {config.senderName || 'With All My Love'}
                </p>
              </div>
            </div>

            {config.postscript && (
              <p className="font-serif-editorial italic text-sm text-[#5E1120] max-w-xs sm:text-right">
                {config.postscript}
              </p>
            )}
          </footer>
        </article>
      )}
    </section>
  );
};

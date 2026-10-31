import React, { useState } from 'react';
import { BrainCircuit, Feather, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { LetterConfig } from '../types/letter';

interface GeminiPoeticAtelierProps {
  config: LetterConfig;
  onApplyGeneratedLetter: (partial: Partial<LetterConfig>) => void;
}

export const GeminiPoeticAtelier: React.FC<GeminiPoeticAtelierProps> = ({
  config,
  onApplyGeneratedLetter,
}) => {
  const [memoriesPrompt, setMemoriesPrompt] = useState(
    'Her birthday is November 01, 2026. She loves vintage bookstores, rainy autumn evenings, gold jewelry, and how we always share a glass of merlot while listening to classical piano.'
  );
  const [poeticTone, setPoeticTone] = useState<
    'victorian_romance' | 'cinematic_nostalgia' | 'tender_devotion'
  >('victorian_romance');
  const [loadingMode, setLoadingMode] = useState<
    'deep' | 'rewrite' | 'quick' | null
  >(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'info'>('info');

  const handleDeepThinkingCompose = async () => {
    if (!memoriesPrompt.trim()) {
      setStatusType('info');
      setStatusMessage('Please describe a few shared memories or details first.');
      return;
    }
    setLoadingMode('deep');
    setStatusMessage(null);

    try {
      const response = await fetch('/api/gemini/compose-deep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: config.recipientName,
          senderName: config.senderName,
          occasionTitle: config.occasionTitle,
          occasionDate: config.occasionDate,
          memoriesPrompt,
          poeticTone,
        }),
      });
      const data = await response.json();
      if (data && data.letter) {
        onApplyGeneratedLetter({
          salutation: data.letter.salutation || config.salutation,
          paragraphs:
            Array.isArray(data.letter.paragraphs) &&
            data.letter.paragraphs.length > 0
              ? data.letter.paragraphs
              : config.paragraphs,
          pullQuote: data.letter.pullQuote || config.pullQuote,
          postscript: data.letter.postscript || config.postscript,
        });
        setStatusType('success');
        setStatusMessage(
          data.source === 'gemini-4-argon-high'
            ? 'Composed with Gemini 4 Argon (High Thinking Mode) and applied to your vintage parchment.'
            : 'Crafted a bespoke vintage letter tailored to your memories and applied it to the parchment.'
        );
      }
    } catch {
      setStatusType('info');
      setStatusMessage('Could not reach the poetic atelier server. Please try again.');
    } finally {
      setLoadingMode(null);
    }
  };

  const handleToneRewrite = async (styleLabel: string) => {
    setLoadingMode('rewrite');
    setStatusMessage(null);
    try {
      const response = await fetch('/api/gemini/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paragraphs: config.paragraphs,
          recipientName: config.recipientName,
          styleLabel,
        }),
      });
      const data = await response.json();
      if (data && Array.isArray(data.paragraphs) && data.paragraphs.length > 0) {
        onApplyGeneratedLetter({
          paragraphs: data.paragraphs,
          pullQuote: data.pullQuote || config.pullQuote,
        });
        setStatusType('success');
        setStatusMessage(`Refined prose in "${styleLabel}" style using Gemini 3.8 Flash.`);
      }
    } catch {
      setStatusType('info');
      setStatusMessage('Unable to refine prose right now.');
    } finally {
      setLoadingMode(null);
    }
  };

  const handleQuickSlideCaptions = async () => {
    setLoadingMode('quick');
    setStatusMessage(null);
    try {
      const response = await fetch('/api/gemini/quick-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: config.recipientName,
          occasionDate: config.occasionDate,
          memoriesPrompt,
          slideCount: config.slides.length,
        }),
      });
      const data = await response.json();
      if (data && Array.isArray(data.captions)) {
        const updatedSlides = config.slides.map((slide, idx) => ({
          ...slide,
          caption: data.captions[idx] || slide.caption,
        }));
        onApplyGeneratedLetter({ slides: updatedSlides });
        setStatusType('success');
        setStatusMessage('Updated slide captions with Gemini 3.1 Flash Lite.');
      }
    } catch {
      setStatusType('info');
      setStatusMessage('Unable to refresh slide captions right now.');
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#23060C]/95 p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#F5E1A4]/80">
            <BrainCircuit className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Gemini Poetic Atelier</span>
            <span aria-hidden="true">·</span>
            <span>High Thinking Mode Enabled</span>
          </div>
          <h3 className="font-serif-editorial text-2xl text-[#FBF6EE] mt-1">
            Bespoke Love Letter &amp; Caption Composer
          </h3>
        </div>
      </div>

      {/* Personal Memories Input */}
      <div>
        <label
          htmlFor="gemini-memories-input"
          className="block text-xs font-medium text-[#F5E1A4] mb-1.5"
        >
          Shared Memories, Inside Jokes &amp; November 1st Details
        </label>
        <textarea
          id="gemini-memories-input"
          rows={3}
          value={memoriesPrompt}
          onChange={(e) => setMemoriesPrompt(e.target.value)}
          placeholder="Tell the atelier about how you met, her favorite things, or your plans for November 01, 2026..."
          className="w-full rounded-xl bg-[#160408] border border-[#D4AF37]/30 px-3.5 py-2.5 text-sm text-[#FBF6EE] placeholder:text-[#E8D5B5]/40 focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      {/* Tone Selector */}
      <div>
        <span className="block text-xs font-medium text-[#F5E1A4] mb-2">
          Literary Voice
        </span>
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#160408] rounded-xl border border-[#D4AF37]/20">
          {[
            { id: 'victorian_romance', label: 'Vintage Romance' },
            { id: 'cinematic_nostalgia', label: 'Warm Nostalgia' },
            { id: 'tender_devotion', label: 'Modern Poetic' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setPoeticTone(
                  item.id as
                    | 'victorian_romance'
                    | 'cinematic_nostalgia'
                    | 'tender_devotion'
                )
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 truncate ${
                poeticTone === item.id
                  ? 'bg-[#4B0E1B] text-[#F5E1A4] border border-[#D4AF37]/40'
                  : 'text-[#E8D5B5]/70 hover:text-[#FBF6EE]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action: Deep Thinking Letter Composition (gemini-4-argon + ThinkingLevel.HIGH) */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={loadingMode !== null}
          onClick={handleDeepThinkingCompose}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#1E0509] bg-gradient-to-r from-[#F5E1A4] via-[#D4AF37] to-[#C59B27] hover:brightness-110 disabled:opacity-60 transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
        >
          {loadingMode === 'deep' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Reasoning Deeply on Your Memories (Gemini 4 Argon)...
            </>
          ) : (
            <>
              <BrainCircuit className="w-4 h-4" />
              Compose Deep Personal Letter (High Thinking)
            </>
          )}
        </button>

        {/* Secondary Fast Actions: Gemini 3.8 Flash & Gemini 3.1 Flash Lite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={loadingMode !== null}
            onClick={() => handleToneRewrite('Poetic Gold & Velvet')}
            className="py-2 px-3 rounded-xl text-xs font-medium text-[#F5E1A4] bg-[#2D0910] border border-[#D4AF37]/35 hover:bg-[#3F0D17] disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {loadingMode === 'rewrite' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            )}
            Polish Prose (Gemini 3.8 Flash)
          </button>

          <button
            type="button"
            disabled={loadingMode !== null}
            onClick={handleQuickSlideCaptions}
            className="py-2 px-3 rounded-xl text-xs font-medium text-[#F5E1A4] bg-[#2D0910] border border-[#D4AF37]/35 hover:bg-[#3F0D17] disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          >
            {loadingMode === 'quick' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            )}
            Instant Slide Captions (Flash Lite)
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className={`rounded-xl px-3.5 py-2.5 text-xs flex items-center gap-2 border ${
            statusType === 'success'
              ? 'bg-[#2E0B14] border-[#D4AF37]/50 text-[#F5E1A4]'
              : 'bg-[#1A0408] border-[#D4AF37]/25 text-[#E8D5B5]'
          }`}
        >
          <Feather className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};

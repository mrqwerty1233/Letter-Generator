import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Link2, Sparkles, X } from 'lucide-react';
import { LetterConfig } from '../types/letter';
import { formatEditorialDate, getWaxSealMonogram } from '../utils/letterCodec';

interface ShareUrlModalProps {
  isOpen: boolean;
  shareUrl: string;
  shortUrl: string;
  config: LetterConfig;
  onClose: () => void;
  onEnterRecipientMode: () => void;
}

export const ShareUrlModal: React.FC<ShareUrlModalProps> = ({
  isOpen,
  shareUrl,
  shortUrl,
  config,
  onClose,
  onEnterRecipientMode,
}) => {
  const [copiedMode, setCopiedMode] = useState<'short' | 'full' | null>(null);

  if (!isOpen) return null;

  const monogram = getWaxSealMonogram(
    config.senderName,
    config.recipientName,
    config.waxMonogram
  );

  const handleCopy = async (text: string, mode: 'short' | 'full') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMode(mode);
      window.setTimeout(() => setCopiedMode(null), 2500);
    } catch {
      setCopiedMode(mode);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shareable Birthday & Occasion Website Link"
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-[#D4AF37]/55 bg-[#21050B] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#D4AF37]/25 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#F5E1A4]/80">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ready to Share on {formatEditorialDate(config.occasionDate)}</span>
            </div>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#FBF6EE] mt-1">
              Your Generated Website URL Is Sealed
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share modal"
            className="w-9 h-9 rounded-lg bg-[#2D0910] border border-[#D4AF37]/35 text-[#F5E1A4] hover:bg-[#420C17] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Keepsake Invitation Preview Card */}
        <div className="rounded-xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#3D0B16] via-[#28060E] to-[#170307] p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#F5E1A4]/75">
              For {config.recipientName} · {formatEditorialDate(config.occasionDate)}
            </p>
            <h4 className="font-serif-editorial text-2xl text-[#F5E1A4] mt-1">
              {config.occasionTitle}
            </h4>
            <p className="text-xs text-[#E8D5B5]/80 mt-1">
              Includes Animated Wax-Sealed Letter · {config.slides.length} Photo Slides ·{' '}
              Classical Music Box
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFF0B8] via-[#D4AF37] to-[#8C6210] p-1 shrink-0 flex items-center justify-center shadow-lg">
            <div className="w-full h-full rounded-full border border-dashed border-[#380A14] flex items-center justify-center">
              <span className="font-serif-editorial font-bold text-sm text-[#380A14]">
                {monogram}
              </span>
            </div>
          </div>
        </div>

        {/* Short Saved Link */}
        <div className="space-y-3">
          <div>
            <label
              htmlFor="short-share-url-input"
              className="block text-xs font-medium text-[#F5E1A4] mb-1.5"
            >
              Direct Shareable Website URL (Send this link to {config.recipientName})
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="short-share-url-input"
                  type="text"
                  readOnly
                  value={shortUrl}
                  className="w-full rounded-xl bg-[#140306] border border-[#D4AF37]/35 pl-10 pr-3.5 py-2.5 text-xs text-[#FBF6EE] font-mono focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCopy(shortUrl, 'short')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1E0509] bg-gradient-to-r from-[#F5E1A4] via-[#D4AF37] to-[#C59B27] hover:brightness-110 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                {copiedMode === 'short' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied Link
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy URL
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Self-Contained Portable URL with Embedded Hash */}
          <div>
            <label
              htmlFor="portable-share-url-input"
              className="block text-xs font-medium text-[#E8D5B5]/80 mb-1.5"
            >
              Self-Contained Portable Link (Encodes full letter &amp; slides inside the URL itself)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="portable-share-url-input"
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-xl bg-[#140306] border border-[#D4AF37]/25 px-3.5 py-2 text-xs text-[#E8D5B5]/80 font-mono focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(shareUrl, 'full')}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#F5E1A4] bg-[#2D0910] border border-[#D4AF37]/35 hover:bg-[#3F0D17] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                {copiedMode === 'full' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Copied Portable Link
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Copy Portable URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D4AF37]/20">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEnterRecipientMode();
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#F5E1A4] bg-[#2D0910] border border-[#D4AF37]/40 hover:bg-[#3F0D17] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            Open Full-Screen Recipient Experience Now
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#E8D5B5] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

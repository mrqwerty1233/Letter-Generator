import React from 'react';

interface FlowerBloomOrnamentProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Vintage Wine-Red & Antique Gold Rose Bloom Ornament.
 * Softly unfurls its layered petals, gold filigree leaves, and pollen motes
 * whenever its parent `.photo-bloom-trigger` is hovered or focused.
 */
export const FlowerBloomOrnament: React.FC<FlowerBloomOrnamentProps> = ({
  size = 'md',
  className = '',
}) => {
  const dimensions =
    size === 'sm'
      ? 'w-9 h-9'
      : size === 'lg'
      ? 'w-16 h-16'
      : 'w-12 h-12';

  const outerAngles = [0, 60, 120, 180, 240, 300];
  const innerAngles = [30, 90, 150, 210, 270, 330];

  return (
    <div
      aria-hidden="true"
      data-testid="flower-bloom-ornament"
      className={`pointer-events-none select-none flower-bloom-root ${dimensions} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-[0_4px_12px_rgba(212,175,55,0.45)]"
      >
        <defs>
          <radialGradient id="roseOuterGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#B82943" />
            <stop offset="65%" stopColor="#6E1426" />
            <stop offset="100%" stopColor="#3B0712" />
          </radialGradient>
          <radialGradient id="roseInnerGrad" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#E04D68" />
            <stop offset="55%" stopColor="#8E1B32" />
            <stop offset="100%" stopColor="#4F0B19" />
          </radialGradient>
          <linearGradient id="goldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF6D1" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8F6512" />
          </linearGradient>
        </defs>

        {/* Gold Filigree Botanical Leaves at Base */}
        <g className="flower-leaf-pair">
          <path
            d="M 50,54 C 26,56 12,42 10,26 C 24,26 40,36 50,54 Z"
            fill="url(#goldLeafGrad)"
            opacity="0.88"
          />
          <path
            d="M 50,54 C 74,56 88,42 90,26 C 76,26 60,36 50,54 Z"
            fill="url(#goldLeafGrad)"
            opacity="0.88"
          />
          <path
            d="M 50,56 C 30,72 22,84 16,90 C 30,86 44,74 50,56 Z"
            fill="url(#goldLeafGrad)"
            opacity="0.72"
          />
          <path
            d="M 50,56 C 70,72 78,84 84,90 C 70,86 56,74 50,56 Z"
            fill="url(#goldLeafGrad)"
            opacity="0.72"
          />
        </g>

        {/* Outer Ring of Velvet Rose Petals */}
        <g className="flower-petal-outer">
          {outerAngles.map((deg) => (
            <g key={`outer-${deg}`} transform={`rotate(${deg} 50 50)`}>
              <path
                d="M 50,50 C 35,34 33,14 50,10 C 67,14 65,34 50,50 Z"
                fill="url(#roseOuterGrad)"
                stroke="#F5E1A4"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
            </g>
          ))}
        </g>

        {/* Inner Ring of Velvet Rose Petals */}
        <g className="flower-petal-inner">
          {innerAngles.map((deg) => (
            <g key={`inner-${deg}`} transform={`rotate(${deg} 50 50)`}>
              <path
                d="M 50,50 C 40,38 39,23 50,19 C 61,23 60,38 50,50 Z"
                fill="url(#roseInnerGrad)"
                stroke="#FFF3C4"
                strokeWidth="1"
                strokeOpacity="0.85"
              />
            </g>
          ))}
        </g>

        {/* Golden Stamen Heart */}
        <circle
          cx="50"
          cy="50"
          r="7.5"
          fill="url(#goldLeafGrad)"
          stroke="#FFF8DC"
          strokeWidth="1.2"
        />
        <circle cx="50" cy="50" r="3.2" fill="#FFFDF5" />

        {/* Floating Golden Pollen Dewdrops */}
        <circle
          cx="50"
          cy="50"
          r="2.4"
          fill="#FFF6D1"
          className="flower-pollen-mote flower-pollen-mote-1"
        />
        <circle
          cx="50"
          cy="50"
          r="2"
          fill="#F5E1A4"
          className="flower-pollen-mote flower-pollen-mote-2"
        />
        <circle
          cx="50"
          cy="50"
          r="2.2"
          fill="#D4AF37"
          className="flower-pollen-mote flower-pollen-mote-3"
        />
        <circle
          cx="50"
          cy="50"
          r="1.9"
          fill="#FFF8DC"
          className="flower-pollen-mote flower-pollen-mote-4"
        />
      </svg>
    </div>
  );
};

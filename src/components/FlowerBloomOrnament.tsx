import React, { useId } from 'react';

interface FlowerBloomOrnamentProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  mirror?: boolean;
}

const OUTER_ANGLES = [0, 60, 120, 180, 240, 300];
const MID_ANGLES = [30, 90, 150, 210, 270, 330];
const INNER_ANGLES = [0, 72, 144, 216, 288];
const STAMEN_ANGLES = [15, 75, 135, 195, 255, 315];

/**
 * Optimized Vintage Wine-Red & Antique Gold Rose Bloom Ornament.
 * - Uses React.memo and scoped SVG <defs> IDs via useId() to prevent duplicate ID collisions.
 * - Avoids expensive CSS filter: drop-shadow() rasterization during animation by using
 *   an internal SVG radial glow layer + GPU-composited transform/opacity transitions.
 * - Features a 3-tier staggered rose petal unfurl, gold filigree leaves, and drifting petals.
 */
export const FlowerBloomOrnament: React.FC<FlowerBloomOrnamentProps> = React.memo(
  ({ size = 'md', className = '', mirror = false }) => {
    const rawId = useId().replace(/:/g, '');
    const outerGradId = `roseOuter-${rawId}`;
    const midGradId = `roseMid-${rawId}`;
    const innerGradId = `roseInner-${rawId}`;
    const goldGradId = `goldFiligree-${rawId}`;
    const haloGradId = `goldHalo-${rawId}`;

    const dimensions =
      size === 'sm'
        ? 'w-9 h-9'
        : size === 'lg'
        ? 'w-16 h-16'
        : 'w-13 h-13';

    return (
      <div
        aria-hidden="true"
        data-testid="flower-bloom-ornament"
        className={`pointer-events-none select-none flower-bloom-root ${dimensions} ${
          mirror ? 'scale-x-[-1]' : ''
        } ${className}`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Soft GPU-friendly ambient gold-rose glow (replaces expensive CSS drop-shadow filter) */}
            <radialGradient id={haloGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5E1A4" stopOpacity="0.48" />
              <stop offset="52%" stopColor="#B82943" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#160508" stopOpacity="0" />
            </radialGradient>

            {/* Deep Velvet Wine-Red Outer Petals */}
            <radialGradient id={outerGradId} cx="50%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#C82E4B" />
              <stop offset="58%" stopColor="#751428" />
              <stop offset="100%" stopColor="#3B0712" />
            </radialGradient>

            {/* Damask Crimson Middle Petals */}
            <radialGradient id={midGradId} cx="50%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#E64C6B" />
              <stop offset="55%" stopColor="#941C35" />
              <stop offset="100%" stopColor="#4D0A18" />
            </radialGradient>

            {/* Blush-Rose Inner Bud Crown */}
            <radialGradient id={innerGradId} cx="50%" cy="28%" r="65%">
              <stop offset="0%" stopColor="#FF8DA6" />
              <stop offset="52%" stopColor="#BD2847" />
              <stop offset="100%" stopColor="#630E21" />
            </radialGradient>

            {/* Antique Gold Foil Filigree Leaves & Stamen */}
            <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="38%" stopColor="#F5E1A4" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A6010" />
            </linearGradient>
          </defs>

          {/* 0. Ambient Golden-Rose Halo */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill={`url(#${haloGradId})`}
            className="flower-ambient-halo"
          />

          {/* 1. Botanical Gold Filigree Leaves & Curved Vine Tendrils */}
          <g className="flower-leaf-pair">
            {/* Upper Left Leaf */}
            <path
              d="M 60,62 C 34,63 16,47 12,26 C 30,27 48,40 60,62 Z"
              fill={`url(#${goldGradId})`}
              opacity="0.92"
            />
            <path
              d="M 58,60 C 42,49 27,38 15,28"
              stroke="#5E1120"
              strokeWidth="0.9"
              strokeOpacity="0.45"
              fill="none"
            />

            {/* Upper Right Leaf */}
            <path
              d="M 60,62 C 86,63 104,47 108,26 C 90,27 72,40 60,62 Z"
              fill={`url(#${goldGradId})`}
              opacity="0.92"
            />
            <path
              d="M 62,60 C 78,49 93,38 105,28"
              stroke="#5E1120"
              strokeWidth="0.9"
              strokeOpacity="0.45"
              fill="none"
            />

            {/* Lower Left Sepal */}
            <path
              d="M 60,64 C 38,80 26,95 19,104 C 36,99 52,85 60,64 Z"
              fill={`url(#${goldGradId})`}
              opacity="0.78"
            />

            {/* Lower Right Sepal */}
            <path
              d="M 60,64 C 82,80 94,95 101,104 C 84,99 68,85 60,64 Z"
              fill={`url(#${goldGradId})`}
              opacity="0.78"
            />

            {/* Delicate Gold Vine Tendril Curls */}
            <path
              d="M 46,68 C 26,76 14,72 11,62 C 9,55 16,52 20,57"
              stroke={`url(#${goldGradId})`}
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M 74,68 C 94,76 106,72 109,62 C 111,55 104,52 100,57"
              stroke={`url(#${goldGradId})`}
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </g>

          {/* 2. Outer Ring of Scalloped Velvet Rose Petals */}
          <g className="flower-petal-outer">
            {OUTER_ANGLES.map((deg) => (
              <g key={`outer-${deg}`} transform={`rotate(${deg} 60 60)`}>
                <path
                  d="M 60,60 C 40,44 36,19 52,13 C 56,11.5 60,14 60,16.5 C 60,14 64,11.5 68,13 C 84,19 80,44 60,60 Z"
                  fill={`url(#${outerGradId})`}
                  stroke="#F5E1A4"
                  strokeWidth="1.15"
                  strokeOpacity="0.72"
                />
              </g>
            ))}
          </g>

          {/* 3. Middle Ring of Damask Crimson Petals */}
          <g className="flower-petal-mid">
            {MID_ANGLES.map((deg) => (
              <g key={`mid-${deg}`} transform={`rotate(${deg} 60 60)`}>
                <path
                  d="M 60,60 C 44,46 42,25 55,20 C 58,19 60,21 60,22.5 C 60,21 62,19 65,20 C 78,25 76,46 60,60 Z"
                  fill={`url(#${midGradId})`}
                  stroke="#FFF3C4"
                  strokeWidth="1"
                  strokeOpacity="0.82"
                />
              </g>
            ))}
          </g>

          {/* 4. Inner Rosebud Crown & Golden Pearl Stamen */}
          <g className="flower-petal-inner">
            {INNER_ANGLES.map((deg) => (
              <g key={`inner-${deg}`} transform={`rotate(${deg} 60 60)`}>
                <path
                  d="M 60,60 C 49,50 48,34 60,30 C 72,34 71,50 60,60 Z"
                  fill={`url(#${innerGradId})`}
                  stroke="#FFF8DC"
                  strokeWidth="0.95"
                  strokeOpacity="0.9"
                />
              </g>
            ))}

            {/* Golden Stamen Filaments */}
            {STAMEN_ANGLES.map((deg) => (
              <g key={`stamen-${deg}`} transform={`rotate(${deg} 60 60)`}>
                <line
                  x1="60"
                  y1="60"
                  x2="60"
                  y2="46"
                  stroke="#F5E1A4"
                  strokeWidth="1"
                  strokeOpacity="0.85"
                />
                <circle cx="60" cy="45" r="1.8" fill="#FFF8DC" />
              </g>
            ))}

            {/* Central Antique Gold Heart Core */}
            <circle
              cx="60"
              cy="60"
              r="7.2"
              fill={`url(#${goldGradId})`}
              stroke="#FFFDF5"
              strokeWidth="1.2"
            />
            <circle cx="60" cy="60" r="3" fill="#FFFDF5" />
          </g>

          {/* 5. Detached Wafting Rose Petals (drift outward on hover) */}
          <g className="flower-drifting-petal flower-drifting-petal-1">
            <path
              d="M 60,60 C 55,52 56,44 61,43 C 66,44 65,52 60,60 Z"
              fill={`url(#${midGradId})`}
              stroke="#F5E1A4"
              strokeWidth="0.8"
            />
          </g>
          <g className="flower-drifting-petal flower-drifting-petal-2">
            <path
              d="M 60,60 C 56,53 57,46 61,45 C 65,46 64,53 60,60 Z"
              fill={`url(#${innerGradId})`}
              stroke="#FFF3C4"
              strokeWidth="0.8"
            />
          </g>
          <g className="flower-drifting-petal flower-drifting-petal-3">
            <path
              d="M 60,60 C 56,53 57,46 61,45 C 65,46 64,53 60,60 Z"
              fill={`url(#${outerGradId})`}
              stroke="#F5E1A4"
              strokeWidth="0.8"
            />
          </g>

          {/* 6. Floating Golden Pollen Dewdrops */}
          <circle
            cx="60"
            cy="60"
            r="2.4"
            fill="#FFF8DC"
            className="flower-pollen-mote flower-pollen-mote-1"
          />
          <circle
            cx="60"
            cy="60"
            r="2"
            fill="#F5E1A4"
            className="flower-pollen-mote flower-pollen-mote-2"
          />
          <circle
            cx="60"
            cy="60"
            r="2.2"
            fill="#D4AF37"
            className="flower-pollen-mote flower-pollen-mote-3"
          />
          <circle
            cx="60"
            cy="60"
            r="1.8"
            fill="#FFFDF5"
            className="flower-pollen-mote flower-pollen-mote-4"
          />
        </svg>
      </div>
    );
  }
);

FlowerBloomOrnament.displayName = 'FlowerBloomOrnament';

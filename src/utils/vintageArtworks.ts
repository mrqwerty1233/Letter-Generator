/**
 * Handcrafted SVG Data-URI Vintage Artworks & Illustrations
 * Zero external image host dependencies — guaranteed instant load and crisp rendering at any resolution.
 */

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const VINTAGE_ARTWORKS: Record<
  string,
  { id: string; label: string; subtitle: string; dataUri: string }
> = {
  golden_hour_promenade: {
    id: 'golden_hour_promenade',
    label: 'November 1st Golden Hour',
    subtitle: 'Autumn garden promenade in crimson & antique gold',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stop-color="#FFF2C2"/>
            <stop offset="30%" stop-color="#E5B25D"/>
            <stop offset="65%" stop-color="#6B1526"/>
            <stop offset="100%" stop-color="#1E050A"/>
          </radialGradient>
          <linearGradient id="pathGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#2D0810" stop-opacity="0.95"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#sunGlow)"/>
        <!-- Ornate inner vintage frame -->
        <rect x="24" y="24" width="752" height="552" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.55"/>
        <rect x="32" y="32" width="736" height="536" fill="none" stroke="#D4AF37" stroke-width="0.75" stroke-opacity="0.35"/>
        <!-- Sun disk -->
        <circle cx="400" cy="245" r="78" fill="#FFF5D6" fill-opacity="0.88"/>
        <circle cx="400" cy="245" r="98" fill="none" stroke="#F5E1A4" stroke-width="1" stroke-dasharray="4 6" stroke-opacity="0.6"/>
        <!-- Distant autumn hills -->
        <path d="M24 380 Q210 310 400 355 T776 340 L776 576 L24 576 Z" fill="#3C0B16" fill-opacity="0.85"/>
        <path d="M24 420 Q260 365 450 405 T776 395 L776 576 L24 576 Z" fill="#24060D"/>
        <!-- Golden garden pathway -->
        <path d="M365 375 L435 375 L540 576 L260 576 Z" fill="url(#pathGold)"/>
        <!-- Arching autumn boughs & crimson leaves -->
        <g fill="#8B1E32" fill-opacity="0.85">
          <circle cx="110" cy="110" r="85"/>
          <circle cx="210" cy="75" r="70"/>
          <circle cx="690" cy="115" r="90"/>
          <circle cx="590" cy="80" r="68"/>
        </g>
        <g fill="#D4AF37" fill-opacity="0.45">
          <circle cx="165" cy="125" r="45"/>
          <circle cx="635" cy="130" r="48"/>
          <circle cx="310" cy="180" r="6"/>
          <circle cx="485" cy="195" r="5"/>
          <circle cx="275" cy="240" r="4"/>
          <circle cx="520" cy="230" r="5"/>
        </g>
        <!-- Romantic couple silhouette holding hands -->
        <g transform="translate(400, 365)">
          <!-- Left figure -->
          <circle cx="-18" cy="-58" r="11" fill="#160408"/>
          <path d="M-32 -42 Q-18 -46 -6 -40 L-2 28 L-30 28 Z" fill="#160408"/>
          <!-- Right figure (flowing dress) -->
          <circle cx="16" cy="-52" r="10.5" fill="#160408"/>
          <path d="M4 -37 Q16 -41 28 -35 L42 28 L-4 28 Z" fill="#160408"/>
          <!-- Joined hands glow -->
          <circle cx="-1" cy="-12" r="5" fill="#F5E1A4" fill-opacity="0.9"/>
        </g>
        <!-- Bottom calligraphic plate -->
        <text x="400" y="542" text-anchor="middle" fill="#F5E1A4" font-family="Georgia, serif" font-size="15" letter-spacing="4" opacity="0.85">NOVEMBER I · MMXXVI</text>
      </svg>
    `),
  },
  candlelight_merlot_toast: {
    id: 'candlelight_merlot_toast',
    label: 'Candlelight & Velvet Roses',
    subtitle: 'Two glasses of vintage merlot under warm taper candles',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <radialGradient id="candleAmbience" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stop-color="#5E1221"/>
            <stop offset="55%" stop-color="#29070E"/>
            <stop offset="100%" stop-color="#120306"/>
          </radialGradient>
          <radialGradient id="flameHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFF6D6" stop-opacity="0.9"/>
            <stop offset="45%" stop-color="#D4AF37" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#candleAmbience)"/>
        <rect x="24" y="24" width="752" height="552" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.5"/>
        <!-- Table surface -->
        <rect x="24" y="425" width="752" height="151" fill="#1A0408"/>
        <line x1="24" y1="425" x2="776" y2="425" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.5"/>
        <!-- Left & Right Brass Candlesticks -->
        <circle cx="210" cy="180" r="70" fill="url(#flameHalo)"/>
        <circle cx="590" cy="180" r="70" fill="url(#flameHalo)"/>
        <!-- Left candle -->
        <rect x="203" y="205" width="14" height="130" rx="3" fill="#FBF2DE"/>
        <path d="M210 165 Q220 185 210 202 Q200 185 210 165 Z" fill="#FFE89E"/>
        <path d="M185 335 L235 335 L222 425 L198 425 Z" fill="#C99E32"/>
        <!-- Right candle -->
        <rect x="583" y="205" width="14" height="130" rx="3" fill="#FBF2DE"/>
        <path d="M590 165 Q600 185 590 202 Q580 185 590 165 Z" fill="#FFE89E"/>
        <path d="M565 335 L615 335 L602 425 L578 425 Z" fill="#C99E32"/>
        <!-- Two Wine Glasses in Center -->
        <g transform="translate(345, 260)">
          <path d="M-32 0 C-34 55 34 55 32 0 Z" fill="none" stroke="#F5E1A4" stroke-width="2" stroke-opacity="0.8"/>
          <path d="M-29 18 C-25 50 25 50 29 18 Z" fill="#7A1124"/>
          <line x1="0" y1="42" x2="0" y2="162" stroke="#F5E1A4" stroke-width="2" stroke-opacity="0.75"/>
          <ellipse cx="0" cy="162" rx="28" ry="5" fill="#F5E1A4" fill-opacity="0.6"/>
        </g>
        <g transform="translate(455, 260)">
          <path d="M-32 0 C-34 55 34 55 32 0 Z" fill="none" stroke="#F5E1A4" stroke-width="2" stroke-opacity="0.8"/>
          <path d="M-29 18 C-25 50 25 50 29 18 Z" fill="#7A1124"/>
          <line x1="0" y1="42" x2="0" y2="162" stroke="#F5E1A4" stroke-width="2" stroke-opacity="0.75"/>
          <ellipse cx="0" cy="162" rx="28" ry="5" fill="#F5E1A4" fill-opacity="0.6"/>
        </g>
        <!-- Golden spark between glasses -->
        <path d="M400 220 L404 234 L418 238 L404 242 L400 256 L396 242 L382 238 L396 234 Z" fill="#FFF2C2"/>
        <text x="400" y="520" text-anchor="middle" fill="#F5E1A4" font-family="Georgia, serif" font-style="italic" font-size="18" opacity="0.85">"To every quiet evening that became our forever"</text>
      </svg>
    `),
  },
  stargazing_birthday_wish: {
    id: 'stargazing_birthday_wish',
    label: 'Birthday Wishes Under the Stars',
    subtitle: 'Constellations and golden sparklers for November 1st',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="nightWine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#140408"/>
            <stop offset="50%" stop-color="#330A14"/>
            <stop offset="100%" stop-color="#521020"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#nightWine)"/>
        <rect x="24" y="24" width="752" height="552" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.55"/>
        <!-- Celestial Gold Arch -->
        <path d="M120 550 L120 260 A280 280 0 0 1 680 260 L680 550" fill="none" stroke="#D4AF37" stroke-width="1.2" stroke-opacity="0.45"/>
        <!-- Crescent Moon & Constellation -->
        <path d="M425 115 A48 48 0 1 0 475 185 A38 38 0 1 1 425 115 Z" fill="#F5E1A4"/>
        <!-- Stars & Constellation Lines -->
        <polyline points="230,190 290,150 350,175 390,130" fill="none" stroke="#D4AF37" stroke-width="0.8" stroke-dasharray="3 3" stroke-opacity="0.65"/>
        <polyline points="520,160 575,195 620,145" fill="none" stroke="#D4AF37" stroke-width="0.8" stroke-dasharray="3 3" stroke-opacity="0.65"/>
        <g fill="#FFF4CC">
          <circle cx="230" cy="190" r="3.5"/>
          <circle cx="290" cy="150" r="4"/>
          <circle cx="350" cy="175" r="3"/>
          <circle cx="390" cy="130" r="4.5"/>
          <circle cx="520" cy="160" r="3.5"/>
          <circle cx="575" cy="195" r="4"/>
          <circle cx="620" cy="145" r="3.5"/>
        </g>
        <!-- Vintage Birthday Cake on Gold Pedestal -->
        <g transform="translate(400, 415)">
          <ellipse cx="0" cy="52" rx="115" ry="16" fill="#D4AF37" fill-opacity="0.4"/>
          <path d="M-45 52 L45 52 L20 88 L-20 88 Z" fill="#C89D2E"/>
          <rect x="-85" y="-8" width="170" height="58" rx="8" fill="#FBF2E3" stroke="#D4AF37" stroke-width="1.5"/>
          <rect x="-62" y="-52" width="124" height="44" rx="6" fill="#F7E8D0" stroke="#D4AF37" stroke-width="1.5"/>
          <!-- Gold Garland on Cake -->
          <path d="M-85 12 Q-42 28 0 12 Q42 28 85 12" fill="none" stroke="#8B1E32" stroke-width="3"/>
          <!-- Birthday Candle & Sparkler -->
          <rect x="-4" y="-88" width="8" height="36" fill="#8B1E32"/>
          <circle cx="0" cy="-98" r="24" fill="#F5E1A4" fill-opacity="0.35"/>
          <path d="M0 -114 L4 -100 L18 -96 L4 -92 L0 -78 L-4 -92 L-18 -96 L-4 -100 Z" fill="#FFF7D6"/>
        </g>
        <text x="400" y="545" text-anchor="middle" fill="#F5E1A4" font-family="Georgia, serif" font-size="15" letter-spacing="3.5" opacity="0.9">HAPPY BIRTHDAY, MY LOVE · 01.11.2026</text>
      </svg>
    `),
  },
  wax_seal_atelier: {
    id: 'wax_seal_atelier',
    label: 'Crimson Rose & Gold Wax Atelier',
    subtitle: 'Hand-sealed parchment correspondence & pressed botanicals',
    dataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <rect width="800" height="600" fill="#22060C"/>
        <rect x="24" y="24" width="752" height="552" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.55"/>
        <!-- Tilted Cream Parchment Sheet -->
        <g transform="translate(400, 295) rotate(-4)">
          <rect x="-210" y="-155" width="420" height="310" rx="4" fill="#F8EFE0" stroke="#D4AF37" stroke-width="1.5"/>
          <rect x="-196" y="-141" width="392" height="282" fill="none" stroke="#8B1E32" stroke-width="0.8" stroke-opacity="0.4"/>
          <line x1="-150" y1="-85" x2="80" y2="-85" stroke="#5A1824" stroke-width="2" stroke-opacity="0.45"/>
          <line x1="-150" y1="-50" x2="150" y2="-50" stroke="#5A1824" stroke-width="1.5" stroke-opacity="0.3"/>
          <line x1="-150" y1="-20" x2="140" y2="-20" stroke="#5A1824" stroke-width="1.5" stroke-opacity="0.3"/>
          <line x1="-150" y1="10" x2="120" y2="10" stroke="#5A1824" stroke-width="1.5" stroke-opacity="0.3"/>
          <line x1="-150" y1="40" x2="60" y2="40" stroke="#5A1824" stroke-width="1.5" stroke-opacity="0.3"/>
          <!-- Gold Wax Seal Stamp on Parchment -->
          <circle cx="115" cy="82" r="36" fill="#C59B27" stroke="#FFF0B8" stroke-width="1.5"/>
          <circle cx="115" cy="82" r="27" fill="none" stroke="#5A1824" stroke-width="1" stroke-dasharray="3 2"/>
          <path d="M115 72 C110 64 98 68 98 78 C98 88 115 96 115 96 C115 96 132 88 132 78 C132 68 120 64 115 72 Z" fill="#5A1824"/>
        </g>
        <text x="400" y="545" text-anchor="middle" fill="#F5E1A4" font-family="Georgia, serif" font-size="14" letter-spacing="4" opacity="0.85">SEALED IN GOLD &amp; CRIMSON</text>
      </svg>
    `),
  },
};

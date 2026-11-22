export function generatePlaceholderSvg(type, colorHex = '#706b63') {
  const hex = colorHex || '#706b63';
  if (type === 'side') {
    // Aspect ratio: ~0.283 (170 x 600)
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 600" width="170" height="600">
      <defs>
        <linearGradient id="chromeH" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23ffffff"/>
          <stop offset="35%" stop-color="%23d0d3d8"/>
          <stop offset="70%" stop-color="%238a8e96"/>
          <stop offset="100%" stop-color="%23484c52"/>
        </linearGradient>
        <linearGradient id="woodH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="%23422e1e"/>
          <stop offset="100%" stop-color="%232b1d12"/>
        </linearGradient>
        <linearGradient id="bodySide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${encodeURIComponent(hex)}" stop-opacity="0.95"/>
          <stop offset="45%" stop-color="${encodeURIComponent(hex)}"/>
          <stop offset="100%" stop-color="${encodeURIComponent(hex)}" stop-opacity="0.75"/>
        </linearGradient>
        <filter id="dropG" x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity="0.18"/>
        </filter>
      </defs>
      <!-- Chrome hook touching top edge y=0 -->
      <path d="M 85 0 C 98 0, 105 8, 105 18 C 105 28, 95 34, 85 36 L 85 46" fill="none" stroke="url(%23chromeH)" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Wooden neck profile -->
      <path d="M 72 44 L 98 44 L 95 62 L 75 62 Z" fill="url(%23woodH)"/>
      <!-- Garment side silhouette -->
      <g filter="url(%23dropG)">
        <path d="M 75 58 C 70 70, 60 92, 56 125 C 48 185, 46 295, 50 455 C 52 490, 55 525, 57 546 C 58 554, 63 558, 72 558 C 86 558, 98 556, 110 554 C 115 553, 117 546, 116 538 C 114 470, 112 360, 112 295 C 112 235, 116 145, 104 75 C 98 64, 88 58, 75 58 Z" fill="url(%23bodySide)"/>
        <!-- Sleeve drape -->
        <path d="M 80 84 C 94 92, 112 108, 120 132 C 130 165, 128 235, 124 325 C 120 415, 114 485, 110 518 C 108 528, 98 532, 88 530 C 80 528, 76 520, 78 506 C 82 458, 88 380, 88 310 C 88 230, 83 140, 78 95 Z" fill="${encodeURIComponent(hex)}" opacity="0.94"/>
        <!-- Sleeve fold highlights and seams -->
        <path d="M 86 175 Q 106 225, 98 295" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="2" stroke-linecap="round"/>
        <path d="M 83 330 Q 104 390, 96 450" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="2" stroke-linecap="round"/>
        <path d="M 68 120 Q 64 260, 66 420" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
        <!-- Cuff -->
        <line x1="78" y1="508" x2="110" y2="514" stroke="rgba(0,0,0,0.28)" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </svg>`;
  } else if (type === 'front') {
    // Aspect ratio: ~0.700 (420 x 600)
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 600" width="420" height="600">
      <defs>
        <linearGradient id="chromeH2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23ffffff"/>
          <stop offset="35%" stop-color="%23d0d3d8"/>
          <stop offset="70%" stop-color="%238a8e96"/>
          <stop offset="100%" stop-color="%23484c52"/>
        </linearGradient>
        <linearGradient id="woodBar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="%233a2516"/>
          <stop offset="50%" stop-color="%2368482f"/>
          <stop offset="100%" stop-color="%233a2516"/>
        </linearGradient>
        <linearGradient id="bodyFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${encodeURIComponent(hex)}"/>
          <stop offset="100%" stop-color="${encodeURIComponent(hex)}" stop-opacity="0.88"/>
        </linearGradient>
        <filter id="dropG2" x="-15%" y="-8%" width="130%" height="116%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-opacity="0.18"/>
        </filter>
      </defs>
      <!-- Hook touching y=0 -->
      <path d="M 210 0 C 224 0, 233 9, 233 20 C 233 30, 222 37, 210 39 L 210 52" fill="none" stroke="url(%23chromeH2)" stroke-width="4.5" stroke-linecap="round"/>
      <!-- Wooden Hanger -->
      <path d="M 210 48 L 380 92 C 385 94, 386 98, 382 101 L 372 106 C 368 108, 364 106, 360 104 L 210 65 L 60 104 C 56 106, 52 108, 48 106 L 38 101 C 34 98, 35 94, 40 92 Z" fill="url(%23woodBar)"/>
      <!-- Front Garment Body -->
      <g filter="url(%23dropG2)">
        <path d="M 165 78 C 180 72, 240 72, 255 78 L 362 104 C 378 108, 392 125, 396 148 L 412 360 C 414 382, 398 395, 378 390 L 350 382 C 336 378, 328 365, 328 350 L 334 220 L 334 520 C 334 538, 322 548, 305 548 L 115 548 C 98 548, 86 538, 86 520 L 86 220 L 92 350 C 92 365, 84 378, 70 382 L 42 390 C 22 395, 6 382, 8 360 L 24 148 C 28 125, 42 108, 58 104 Z" fill="url(%23bodyFront)"/>
        <!-- Collar / Lapel shadow & flaps -->
        <path d="M 165 78 L 195 145 L 210 148 L 225 145 L 255 78 L 210 88 Z" fill="rgba(0,0,0,0.22)"/>
        <path d="M 162 76 L 196 142 L 140 120 Z" fill="${encodeURIComponent(hex)}" stroke="rgba(0,0,0,0.18)" stroke-width="1.5"/>
        <path d="M 258 76 L 224 142 L 280 120 Z" fill="${encodeURIComponent(hex)}" stroke="rgba(0,0,0,0.18)" stroke-width="1.5"/>
        <!-- Center zipper placket -->
        <line x1="210" y1="148" x2="210" y2="548" stroke="rgba(0,0,0,0.32)" stroke-width="3"/>
        <line x1="209" y1="148" x2="209" y2="548" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
        <!-- Pockets -->
        <rect x="115" y="165" width="62" height="42" rx="4" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
        <rect x="243" y="165" width="62" height="42" rx="4" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
        <!-- Waist welt seams -->
        <path d="M 112 375 Q 140 380, 140 435" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 308 375 Q 280 380, 280 435" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="86" y1="512" x2="334" y2="512" stroke="rgba(0,0,0,0.22)" stroke-width="2"/>
      </g>
    </svg>`;
  } else {
    // Back view (420 x 600)
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 600" width="420" height="600">
      <defs>
        <linearGradient id="chromeH3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="%23ffffff"/>
          <stop offset="35%" stop-color="%23d0d3d8"/>
          <stop offset="70%" stop-color="%238a8e96"/>
          <stop offset="100%" stop-color="%23484c52"/>
        </linearGradient>
        <linearGradient id="woodBar3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="%233a2516"/>
          <stop offset="50%" stop-color="%2368482f"/>
          <stop offset="100%" stop-color="%233a2516"/>
        </linearGradient>
        <linearGradient id="bodyBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${encodeURIComponent(hex)}"/>
          <stop offset="100%" stop-color="${encodeURIComponent(hex)}" stop-opacity="0.88"/>
        </linearGradient>
        <filter id="dropG3" x="-15%" y="-8%" width="130%" height="116%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-opacity="0.18"/>
        </filter>
      </defs>
      <path d="M 210 0 C 224 0, 233 9, 233 20 C 233 30, 222 37, 210 39 L 210 52" fill="none" stroke="url(%23chromeH3)" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M 210 48 L 380 92 C 385 94, 386 98, 382 101 L 372 106 C 368 108, 364 106, 360 104 L 210 65 L 60 104 C 56 106, 52 108, 48 106 L 38 101 C 34 98, 35 94, 40 92 Z" fill="url(%23woodBar3)"/>
      <g filter="url(%23dropG3)">
        <path d="M 165 78 C 180 72, 240 72, 255 78 L 362 104 C 378 108, 392 125, 396 148 L 412 360 C 414 382, 398 395, 378 390 L 350 382 C 336 378, 328 365, 328 350 L 334 220 L 334 520 C 334 538, 322 548, 305 548 L 115 548 C 98 548, 86 538, 86 520 L 86 220 L 92 350 C 92 365, 84 378, 70 382 L 42 390 C 22 395, 6 382, 8 360 L 24 148 C 28 125, 42 108, 58 104 Z" fill="url(%23bodyBack)"/>
        <path d="M 165 78 Q 210 92, 255 78 Q 210 70, 165 78 Z" fill="rgba(0,0,0,0.25)"/>
        <path d="M 100 155 Q 210 185, 320 155" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="2.5"/>
        <line x1="210" y1="172" x2="210" y2="512" stroke="rgba(0,0,0,0.22)" stroke-width="2"/>
        <line x1="86" y1="512" x2="334" y2="512" stroke="rgba(0,0,0,0.22)" stroke-width="2"/>
      </g>
    </svg>`;
  }
}

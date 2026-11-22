import React, { useState, useRef } from 'react';
import ClothesRack from './ClothesRack.jsx';
import { CONTENT } from '../data/content.js';

const DEFAULT_SUBTEXT = 'Hover a piece to inspect — Click to explore 360° atelier turntable';

export default function Hero({ onSelectGarment, rackRef, onViewAll }) {
  const [subtext, setSubtext] = useState(DEFAULT_SUBTEXT);
  const [subtextOpacity, setSubtextOpacity] = useState(1);
  const [activeRackView, setActiveRackView] = useState('samples'); // 'samples' (2 Puffer + 2 Varsity), 'suede' (7), 'all' (13)
  const subtextTimerRef = useRef(null);

  const currentRackItems = activeRackView === 'suede'
    ? CONTENT.suedeProducts
    : CONTENT.sampleRack;

  const handleHoverGarment = (index, label) => {
    setSubtextOpacity(0);
    if (subtextTimerRef.current) clearTimeout(subtextTimerRef.current);

    subtextTimerRef.current = setTimeout(() => {
      setSubtext(label || DEFAULT_SUBTEXT);
      setSubtextOpacity(1);
    }, 120);
  };

  return (
    <header className="hero" id="hero">
      <div className="hero-content">
        {/* Eyebrow: COLLECTION TITLE | SUBTITLE */}
        <div className="eyebrow" id="eyebrow">
          <span className="eyebrow-main">Atelier Heritage</span>
          <span className="eyebrow-divider" aria-hidden="true"></span>
          <span className="eyebrow-sub">Autumn / Winter '26 Collection</span>
        </div>

        {/* Big Headline */}
        <h1 className="hero-headline" id="headline">
          Signature Outerwear <span className="headline-dim">& Suede</span>
        </h1>

        {/* Clothes Rack Stage (Curated sample of 2 Puffer + 2 Varsity by default) */}
        <ClothesRack
          key={activeRackView}
          ref={rackRef}
          items={currentRackItems}
          onSelectGarment={onSelectGarment}
          onHoverGarment={handleHoverGarment}
        />

        {/* Rack Switcher Tabs - Rendered as 2 separate buttons on mobile */}
        <div className="rack-sample-selector" role="tablist" aria-label="Hero clothes rack view selector">
          <button
            className={`sample-tab-btn ${activeRackView === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveRackView('samples')}
            role="tab"
            aria-selected={activeRackView === 'samples'}
          >
            <span className="tab-desktop-text">★ Featured Samples (2 Puffer · 2 Varsity)</span>
            <span className="tab-mobile-text">★ Featured Samples</span>
          </button>
          <button
            className={`sample-tab-btn ${activeRackView === 'suede' ? 'active' : ''}`}
            onClick={() => setActiveRackView('suede')}
            role="tab"
            aria-selected={activeRackView === 'suede'}
          >
            Suedo Heritage ({CONTENT.suedeProducts.length})
          </button>
        </div>

        {/* Below the Rack: Subtext & Shop Button */}
        <div className="rack-footer">
          <p
            className="rack-subtext"
            id="rack-subtext"
            style={{ opacity: subtextOpacity, transition: 'opacity 0.2s ease' }}
          >
            {subtext}
          </p>
          <button
            className="pill-button"
            id="shop-cta"
            onClick={onViewAll}
            type="button"
          >
            Shop All 13 Silhouettes →
          </button>
        </div>
      </div>
    </header>
  );
}

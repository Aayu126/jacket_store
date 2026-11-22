import React, { useState } from 'react';
import { CONTENT } from '../data/content.js';

export default function Craftsmanship({ onOpen3DModal }) {
  const [activeType, setActiveType] = useState('suede'); // 'suede' | 'puffer' | 'varsity'
  const currentCategoryData = CONTENT.craftsmanshipData[activeType] || CONTENT.craftsmanshipData.suede;

  const [activeHotspotId, setActiveHotspotId] = useState(currentCategoryData.hotspots[0].id);

  const handleTypeChange = (type) => {
    setActiveType(type);
    const targetData = CONTENT.craftsmanshipData[type] || CONTENT.craftsmanshipData.suede;
    setActiveHotspotId(targetData.hotspots[0].id);
  };

  const activeHotspot = currentCategoryData.hotspots.find(h => h.id === activeHotspotId) || currentCategoryData.hotspots[0];

  const handleOpen3D = () => {
    const targetProduct = CONTENT.allProducts.find(p => p.id === currentCategoryData.productId) || CONTENT.allProducts[0];
    if (onOpen3DModal) {
      onOpen3DModal(targetProduct);
    }
  };

  return (
    <section className="section-craftsmanship" id="craftsmanship">
      <div className="section-container">
        {/* Eyebrow & Title */}
        <div className="craft-header">
          <div className="section-eyebrow">
            <span>{currentCategoryData.eyebrow.split('·')[0].trim()}</span>
            <span className="eyebrow-divider"></span>
            <span>{currentCategoryData.eyebrow.split('·')[1]?.trim() || 'ATELIER TAILORING'}</span>
          </div>
          <h2 className="section-title">{currentCategoryData.title}</h2>
          <p className="section-subtitle">
            {currentCategoryData.subtitle}
          </p>

          {/* Craftsmanship Type Toggle: Suede, Puffer, Varsity */}
          <div className="craft-type-selector" role="tablist" aria-label="Craftsmanship Category Selector">
            <button
              className={`craft-type-pill ${activeType === 'suede' ? 'active' : ''}`}
              onClick={() => handleTypeChange('suede')}
              role="tab"
              aria-selected={activeType === 'suede'}
            >
              ✦ Suede Craftsmanship
            </button>
            <button
              className={`craft-type-pill ${activeType === 'puffer' ? 'active' : ''}`}
              onClick={() => handleTypeChange('puffer')}
              role="tab"
              aria-selected={activeType === 'puffer'}
            >
              ✦ Puffer Craftsmanship
            </button>
            <button
              className={`craft-type-pill ${activeType === 'varsity' ? 'active' : ''}`}
              onClick={() => handleTypeChange('varsity')}
              role="tab"
              aria-selected={activeType === 'varsity'}
            >
              ✦ Varsity Craftsmanship
            </button>
          </div>
        </div>

        {/* Dual Column Layout: Interactive Stage + Narrative Panel */}
        <div className="craft-interactive-stage">
          {/* Left: Garment with Pulsing Hotspots */}
          <div className="craft-visual-wrapper">
            <div className="craft-image-frame">
              <img
                src={currentCategoryData.image}
                alt={`${currentCategoryData.title} anatomical breakdown`}
                className="craft-main-img"
                key={currentCategoryData.image}
              />

              {/* Hotspots */}
              {currentCategoryData.hotspots.map((hs, index) => {
                const isActive = activeHotspotId === hs.id;
                return (
                  <button
                    key={hs.id}
                    className={`craft-hotspot-pin ${isActive ? 'active' : ''}`}
                    style={{ left: hs.x, top: hs.y }}
                    onClick={() => setActiveHotspotId(hs.id)}
                    aria-label={`Inspect detail: ${hs.title}`}
                  >
                    <span className="hotspot-pulse" aria-hidden="true"></span>
                    <span className="hotspot-core" aria-hidden="true"></span>
                    <span className="hotspot-number">{index + 1}</span>
                  </button>
                );
              })}
            </div>
            <div className="craft-hint">
              <span>✦ Click any detail marker to inspect specification</span>
            </div>
          </div>

          {/* Right: Selected Detail Story Panel */}
          <div className="craft-details-panel">
            <div className="craft-card-box">
              <span className="craft-step-counter">DETAIL SPECIFICATION · {currentCategoryData.label.toUpperCase()}</span>
              <h3 className="craft-card-title">{activeHotspot.title}</h3>
              <div className="craft-card-subtitle">{activeHotspot.subtitle}</div>
              <p className="craft-card-desc">{activeHotspot.description}</p>

              {/* Dynamic Spec Checklist */}
              <div className="craft-specs-grid">
                {currentCategoryData.specs.map((sp, idx) => (
                  <div className="spec-item" key={idx}>
                    <span className="spec-val">{sp.val}</span>
                    <span className="spec-lbl">{sp.lbl}</span>
                  </div>
                ))}
              </div>

              {/* Selector Tabs */}
              <div className="craft-selector-tabs">
                {currentCategoryData.hotspots.map((hs, i) => (
                  <button
                    key={hs.id}
                    className={`selector-tab-btn ${activeHotspotId === hs.id ? 'active' : ''}`}
                    onClick={() => setActiveHotspotId(hs.id)}
                  >
                    <span className="tab-num">0{i + 1}</span>
                    <span className="tab-name">{hs.title.split(' ')[0]} {hs.title.split(' ')[1] || ''}</span>
                  </button>
                ))}
              </div>

              <div className="craft-cta-row">
                <button
                  className="pill-button"
                  onClick={handleOpen3D}
                >
                  Inspect in 3D Stage →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

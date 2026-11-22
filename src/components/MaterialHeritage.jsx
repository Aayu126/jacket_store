import React, { useState } from 'react';

export default function MaterialHeritage() {
  const [activeTier, setActiveTier] = useState(0);

  const materials = [
    {
      name: 'Tuscan Lambskin Velour',
      origin: 'Santa Croce sull’Arno, Italy',
      thickness: '0.7 mm calibrated',
      finish: 'Pumice-buffed velvet nap',
      bestFor: 'Trucker, Harrington & Overshirt',
      description: 'Extracted from mature Italian lambskins tanned exclusively with chestnut and mimosa barks. Retains its buttery hand and subtle sheen over decades of wear without cracking.',
      qualities: [
        { label: 'Tactile Softness', score: '98%' },
        { label: 'Tensile Memory', score: '92%' },
        { label: 'Breathability', score: '96%' }
      ]
    },
    {
      name: 'Full-Grain Matte Calf Suede',
      origin: 'Solofra, Campania, Italy',
      thickness: '0.9 mm structural',
      finish: 'Deep pigment matte buff',
      bestFor: 'Bomber & Moto Biker Silhouettes',
      description: 'Calfskin provides superior structural resilience and a heavier drape that holds sharp shoulder silhouettes while aging into a distinctive personal patina.',
      qualities: [
        { label: 'Structure & Weight', score: '99%' },
        { label: 'Wind Resistance', score: '94%' },
        { label: 'Abrasion Endurance', score: '95%' }
      ]
    },
    {
      name: 'Spanish Merinillo Suede',
      origin: 'Catalonia, Spain',
      thickness: '1.1 mm insulated',
      finish: 'Dense fiber grain with natural temper',
      bestFor: 'Aviator & Winter Shearling Cuffs',
      description: 'Known worldwide for ultra-fine fiber density and natural micro-climate insulation. Treated with natural beeswax emulsion for organic water resistance.',
      qualities: [
        { label: 'Thermal Insulation', score: '97%' },
        { label: 'Water Repellency', score: '88%' },
        { label: 'Suppleness', score: '93%' }
      ]
    }
  ];

  return (
    <section className="section-materials" id="materials">
      <div className="section-container">
        <div className="materials-header">
          <div className="section-eyebrow">
            <span>SUSTAINED MATERIALITY</span>
            <span className="eyebrow-divider"></span>
            <span>100% BOTANICAL TANNED</span>
          </div>
          <h2 className="section-title">Hides of Extraordinary Character</h2>
          <p className="section-subtitle">
            We partner with generational family tanneries in Tuscany who tan using natural bark tannins and crystal spring waters.
          </p>
        </div>

        {/* 3 Material Cards */}
        <div className="materials-cards-grid">
          {materials.map((mat, idx) => (
            <div
              key={mat.name}
              className={`material-spec-card ${activeTier === idx ? 'featured' : ''}`}
              onClick={() => setActiveTier(idx)}
            >
              <div className="mat-card-header">
                <span className="mat-origin">{mat.origin}</span>
                <span className="mat-badge">{mat.thickness}</span>
              </div>
              <h3 className="mat-title">{mat.name}</h3>
              <p className="mat-desc">{mat.description}</p>

              <div className="mat-specs-list">
                <div className="spec-row">
                  <span className="spec-name">Finish</span>
                  <span className="spec-data">{mat.finish}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Best Suited</span>
                  <span className="spec-data">{mat.bestFor}</span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mat-scores">
                {mat.qualities.map((q) => (
                  <div key={q.label} className="score-row">
                    <div className="score-top">
                      <span>{q.label}</span>
                      <span>{q.score}</span>
                    </div>
                    <div className="score-track">
                      <div className="score-fill" style={{ width: q.score }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Standards Banner */}
        <div className="materials-banner">
          <div className="banner-col">
            <span className="banner-icon">🌿</span>
            <h4>Zero Chromium-VI</h4>
            <p>100% vegetable extraction using mimosa, quebracho, and chestnut extracts.</p>
          </div>
          <div className="banner-col">
            <span className="banner-icon">♻</span>
            <h4>Traceable Byproduct</h4>
            <p>100% of our hides are byproducts of certified ethical European agriculture.</p>
          </div>
          <div className="banner-col">
            <span className="banner-icon">⏳</span>
            <h4>Heirloom Longevity</h4>
            <p>Naturally replenishing oils allow these garments to be passed down through generations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

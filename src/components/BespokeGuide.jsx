import React, { useState } from 'react';
import { CONTENT } from '../data/content.js';

export default function BespokeGuide() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [unit, setUnit] = useState('in'); // 'in' or 'cm'
  const [userChestInput, setUserChestInput] = useState('');
  const [recommendedSize, setRecommendedSize] = useState(null);

  const sizeData = CONTENT.sizeGuideData[selectedSize];

  const handleRecommend = (e) => {
    e.preventDefault();
    const val = parseFloat(userChestInput);
    if (!val) return;

    const chestInInches = unit === 'in' ? val : val / 2.54;
    if (chestInInches <= 38) setRecommendedSize('S');
    else if (chestInInches <= 41) setRecommendedSize('M');
    else if (chestInInches <= 44) setRecommendedSize('L');
    else setRecommendedSize('XL');
  };

  return (
    <section className="section-bespoke" id="bespoke">
      <div className="section-container">
        <div className="bespoke-header">
          <div className="section-eyebrow">
            <span>PERFECT FIT ADVISOR</span>
            <span className="eyebrow-divider"></span>
            <span>PRECISION MEASUREMENTS</span>
          </div>
          <h2 className="section-title">Tailored Proportions</h2>
          <p className="section-subtitle">
            Our suede jackets are drafted with a contemporary tailored drape: clean across the shoulder with room for fine knitwear beneath.
          </p>
        </div>

        <div className="bespoke-grid">
          {/* Left Column: Sizing Table & Unit Toggle */}
          <div className="bespoke-table-card">
            <div className="table-card-top">
              <div className="size-pill-group">
                {['S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    className={`size-tab-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    Size {sz}
                  </button>
                ))}
              </div>

              <div className="unit-toggle-group">
                <button
                  className={`unit-btn ${unit === 'in' ? 'active' : ''}`}
                  onClick={() => setUnit('in')}
                >
                  Inches
                </button>
                <button
                  className={`unit-btn ${unit === 'cm' ? 'active' : ''}`}
                  onClick={() => setUnit('cm')}
                >
                  CM
                </button>
              </div>
            </div>

            {/* Dimension Breakdown */}
            <div className="dimensions-display">
              <div className="dim-row">
                <span className="dim-name">Recommended Chest</span>
                <span className="dim-value">
                  {unit === 'in' ? `${sizeData.chestInches} inches` : `${sizeData.chestCm} cm`}
                </span>
              </div>
              <div className="dim-row">
                <span className="dim-name">Shoulder Width (Across Back)</span>
                <span className="dim-value">{sizeData.shoulders}</span>
              </div>
              <div className="dim-row">
                <span className="dim-name">Sleeve Length (From Shoulder)</span>
                <span className="dim-value">{sizeData.sleeve}</span>
              </div>
              <div className="dim-row">
                <span className="dim-name">Center Back Length</span>
                <span className="dim-value">{sizeData.length}</span>
              </div>
            </div>

            {/* Quick Sizing Advisor Calculator */}
            <form className="calculator-box" onSubmit={handleRecommend}>
              <label htmlFor="chest-input" className="calc-label">
                Find Your Size: Enter Your Chest Circumference ({unit}):
              </label>
              <div className="calc-input-row">
                <input
                  id="chest-input"
                  type="number"
                  step="0.5"
                  className="calc-input"
                  placeholder={unit === 'in' ? 'e.g. 40' : 'e.g. 102'}
                  value={userChestInput}
                  onChange={(e) => setUserChestInput(e.target.value)}
                />
                <button type="submit" className="calc-btn">
                  Calculate Fit
                </button>
              </div>
              {recommendedSize && (
                <div className="calc-result">
                  <span>Recommended Size: <strong>Size {recommendedSize}</strong> for a clean tailored drape.</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Lifetime Care & Atelier Guarantees */}
          <div className="bespoke-guarantees-card">
            <h3 className="guarantee-card-title">The Atelier Promise</h3>
            <p className="guarantee-card-intro">
              A bespoke suede garment is an intimate possession meant to accompany you through a lifetime of cold mornings and twilight evenings.
            </p>

            <div className="guarantee-pillars">
              <div className="pillar-item">
                <span className="pillar-num">01</span>
                <div className="pillar-content">
                  <h4>Complimentary Annual Reconditioning</h4>
                  <p>Send your jacket to our Florence or Milan atelier once a year for gentle ultrasonic steam cleaning, brass wire brushing, and nap rejuvenating oils.</p>
                </div>
              </div>

              <div className="pillar-item">
                <span className="pillar-num">02</span>
                <div className="pillar-content">
                  <h4>Lifetime Seam & Hardware Warranty</h4>
                  <p>Should any YKK Excella zipper, Bergamo shank button, or saddle seam ever require attention, our tailors will repair it free of charge.</p>
                </div>
              </div>

              <div className="pillar-item">
                <span className="pillar-num">03</span>
                <div className="pillar-content">
                  <h4>Bespoke Custom Sleeve Adjustments</h4>
                  <p>Order with confidence: we offer complimentary sleeve hem tailoring within 30 days of delivery at any of our global salon ateliers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

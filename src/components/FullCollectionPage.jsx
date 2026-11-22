import React, { useState, useEffect } from 'react';
import { CONTENT } from '../data/content.js';
import CollectionCard from './CollectionCard.jsx';

export default function FullCollectionPage({ onOpen3DModal, onBackToHome }) {
  const [activeCategory, setActiveCategory] = useState('All Silhouettes');
  const allList = CONTENT.allProducts;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredJackets = activeCategory === 'All Silhouettes'
    ? allList
    : activeCategory === 'Suede'
      ? allList.filter(j => j.collectionType === 'Suede')
      : activeCategory === 'Puffer'
        ? allList.filter(j => j.category === 'Puffer' || j.collectionType === 'Puffer')
        : activeCategory === 'Varsity'
          ? allList.filter(j => j.category === 'Varsity' || j.collectionType === 'Varsity')
          : allList.filter(j => j.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="full-collection-page" id="collection-page">
      <section className="section-collection" style={{ paddingTop: '24px' }}>
        <div className="section-container">
          {/* Section Header */}
          <div className="collection-header">
            <div className="section-eyebrow">
              <span>PERMANENT ATELIER ARCHIVE</span>
              <span className="eyebrow-divider"></span>
              <span>E-COMMERCE CATALOGUE · {allList.length} SILHOUETTES</span>
            </div>
            <h2 className="section-title">The Complete Outerwear Archive</h2>
            <p className="section-subtitle">
              Every garment in our permanent collection: calibrated 0.7mm Tuscan velour suede, 750-fill power alpine down puffers, and heavy 24oz English wool collegiate varsity jackets. Backed by our 30-day in-home trial and worldwide express courier.
            </p>

            {/* Filter Pills */}
            <div className="collection-filters" role="tablist" aria-label="Silhouette Filters">
              {CONTENT.categories.map((cat) => {
                const count = cat === 'All Silhouettes'
                  ? allList.length
                  : cat === 'Suede'
                    ? allList.filter(j => j.collectionType === 'Suede').length
                    : cat === 'Puffer'
                      ? allList.filter(j => j.collectionType === 'Puffer').length
                      : cat === 'Varsity'
                        ? allList.filter(j => j.collectionType === 'Varsity').length
                        : allList.filter(j => j.category.toLowerCase() === cat.toLowerCase()).length;

                return (
                  <button
                    key={cat}
                    className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    role="tab"
                    aria-selected={activeCategory === cat}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid: All 13 Jackets */}
          <div className="collection-grid">
            {filteredJackets.map((jacket) => (
              <CollectionCard
                key={jacket.id || jacket.name}
                jacket={jacket}
                onOpen3DModal={onOpen3DModal}
              />
            ))}
          </div>

          {/* Bottom Return Button */}
          <div className="collection-page-bottom-nav">
            <button
              className="back-to-home-btn"
              onClick={onBackToHome}
              type="button"
            >
              ← Return to Atelier Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

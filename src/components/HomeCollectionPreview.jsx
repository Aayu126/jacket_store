import React from 'react';
import { CONTENT } from '../data/content.js';
import CollectionCard from './CollectionCard.jsx';

export default function HomeCollectionPreview({ onOpen3DModal, onViewAll }) {
  // Exactly 3 sample jackets for the Home page: 1) Suede, 2) Puffer, 3) Varsity
  const homeSampleJackets = [
    CONTENT.suedeProducts[0], // 1) Suede Trucker Tobacco Brown
    CONTENT.newProducts[0],   // 2) Puffer Jacket Onyx Black
    CONTENT.newProducts[3]    // 3) Varsity Jacket Brown & Sand Beige
  ];

  return (
    <section className="section-collection" id="collection">
      <div className="section-container">
        {/* Section Header */}
        <div className="collection-header">
          <div className="section-eyebrow">
            <span>ATELIER HIGHLIGHTS</span>
            <span className="eyebrow-divider"></span>
            <span>3 SIGNATURE SILHOUETTES</span>
          </div>
          <h2 className="section-title">The Signature Outerwear Edit</h2>
          <p className="section-subtitle">
            Sample our three defining silhouettes: Italian Tuscan velour suede, high-loft down-proof puffers, and vintage collegiate varsity jackets.
          </p>
        </div>

        {/* 3 Sample Product Cards */}
        <div className="collection-grid home-sample-grid">
          {homeSampleJackets.map((jacket) => (
            <CollectionCard
              key={jacket.id || jacket.name}
              jacket={jacket}
              onOpen3DModal={onOpen3DModal}
            />
          ))}
        </div>

        {/* Prominent CTA Button to View All Collection */}
        <div className="collection-view-all-wrap">
          <button
            className="view-all-collection-btn"
            onClick={onViewAll}
            type="button"
          >
            <span>View Full Archive Collection (13 Silhouettes)</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

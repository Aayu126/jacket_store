import React, { useState, useRef } from 'react';
import { CONTENT } from '../data/content.js';
import { useCart } from '../context/CartContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';

export default function CollectionCard({ jacket, onOpen3DModal }) {
  const [currentView, setCurrentView] = useState('front');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickAdded, setIsQuickAdded] = useState(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const { addToCart, openCart } = useCart();
  const { formatPrice } = useCurrency();

  // Swipe / Drag handling to change angles
  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 30) {
      if (diff < 0) {
        // Swiped left: front -> side -> back
        if (currentView === 'front') setCurrentView('side');
        else if (currentView === 'side') setCurrentView('back');
      } else {
        // Swiped right: back -> side -> front
        if (currentView === 'back') setCurrentView('side');
        else if (currentView === 'side') setCurrentView('front');
      }
    }
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(jacket, selectedSize);
    setIsQuickAdded(true);
    openCart();
    setTimeout(() => {
      setIsQuickAdded(false);
    }, 2000);
  };

  return (
    <article
      className="collection-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Frame */}
      <div
        className="card-visual-frame"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="card-tag-badge">
          <span>{jacket.category}</span>
        </div>

        <div className="card-stock-badge">
          <span className="stock-dot"></span>
          <span>In Stock</span>
        </div>

        <div className="card-photo-container" title="Swipe or use tabs below to switch view angle">
          {/* Front View */}
          <img
            src={jacket.front}
            alt={`${jacket.name} front view`}
            className={`card-img front-view ${currentView === 'front' ? 'active' : ''}`}
            loading="lazy"
          />
          {/* Side View */}
          <img
            src={jacket.side}
            alt={`${jacket.name} side view`}
            className={`card-img side-view ${currentView === 'side' ? 'active' : ''}`}
            loading="lazy"
          />
          {/* Back View */}
          <img
            src={jacket.back}
            alt={`${jacket.name} back view`}
            className={`card-img back-view ${currentView === 'back' ? 'active' : ''}`}
            loading="lazy"
          />
        </div>

        {/* Hover Overlay Actions */}
        <div className={`card-actions-overlay ${isHovered ? 'visible' : ''}`}>
          <button
            className="card-quick-3d-btn"
            onClick={() => onOpen3DModal(jacket)}
            aria-label={`Explore ${jacket.name} in 3D turntable`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Inspect 360° View</span>
          </button>
          <button
            className="card-quick-add-btn"
            onClick={handleQuickAdd}
            aria-label={`Add ${jacket.name} size ${selectedSize} to bag`}
          >
            {isQuickAdded ? 'Added ✓' : `+ Add (${selectedSize})`}
          </button>
        </div>
      </div>

      {/* Details Footer */}
      <div className="card-details">
        {/* Rating & Fabric Specification */}
        <div className="card-top-meta">
          <div className="card-color-row">
            <span className="color-swatch-dot" style={{ backgroundColor: jacket.color }} title={jacket.name}></span>
            <span className="card-fabric-spec">{jacket.fabric}</span>
          </div>
          <div className="card-stars">
            <span>★★★★★</span>
            <span className="card-star-score">4.9</span>
          </div>
        </div>

        {/* Product Title & Price */}
        <div className="card-main-info">
          <h3
            className="card-product-title"
            onClick={() => onOpen3DModal(jacket)}
            title="Click to view 3D details"
          >
            {jacket.name}
          </h3>
          <span className="card-product-price">{formatPrice(jacket.numericPrice)}</span>
        </div>

        {/* Front / Side / Back tabs directly below price */}
        <div className="card-view-tabs" role="tablist" aria-label="Select jacket angle view">
          <button
            className={`card-tab-btn ${currentView === 'front' ? 'active' : ''}`}
            role="tab"
            aria-selected={currentView === 'front'}
            onClick={() => setCurrentView('front')}
          >
            Front
          </button>
          <button
            className={`card-tab-btn ${currentView === 'side' ? 'active' : ''}`}
            role="tab"
            aria-selected={currentView === 'side'}
            onClick={() => setCurrentView('side')}
          >
            Side
          </button>
          <button
            className={`card-tab-btn ${currentView === 'back' ? 'active' : ''}`}
            role="tab"
            aria-selected={currentView === 'back'}
            onClick={() => setCurrentView('back')}
          >
            Back
          </button>
        </div>

        {/* Quick Size Pills & Free Shipping note */}
        <div className="card-size-selector-row">
          <span className="size-label-small">Size:</span>
          <div className="card-mini-sizes">
            {CONTENT.garmentSizes.map(sz => (
              <button
                key={sz}
                className={`mini-size-btn ${selectedSize === sz ? 'selected' : ''}`}
                onClick={() => setSelectedSize(sz)}
                type="button"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <p className="card-tagline">{jacket.tagline}</p>

        {/* Shipping badge & Hardware spec */}
        <div className="card-meta-chips">
          <span className="card-perk-badge">✓ Free Express Shipping</span>
          <span className="meta-sep">·</span>
          <span>{jacket.hardware.split(' ')[0]} Hardware</span>
          <span className="meta-sep">·</span>
          <span>{jacket.weight}</span>
        </div>
      </div>
    </article>
  );
}

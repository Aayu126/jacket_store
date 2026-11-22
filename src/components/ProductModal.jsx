import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CONTENT } from '../data/content.js';
import { generatePlaceholderSvg } from '../utils/placeholderSvg.js';
import { useCart } from '../context/CartContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';

export default function ProductModal({ isOpen, productIndex, product, sourceElement, onClose }) {
  const { formatPrice } = useCurrency();
  const [currentView, setCurrentView] = useState('front');
  const [selectedSize, setSelectedSize] = useState(CONTENT.garmentSizes[0]);
  const [isAdded, setIsAdded] = useState(false);

  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const detailsRef = useRef(null);
  const closeBtnRef = useRef(null);

  const tabFrontRef = useRef(null);
  const tabSideRef = useRef(null);
  const tabBackRef = useRef(null);
  const tabUnderlineRef = useRef(null);

  const cardAngleRef = useRef(0);
  const flightAnimRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);

  const allList = CONTENT.allProducts || CONTENT.rack;
  const prod = product || (productIndex !== null && productIndex >= 0 ? allList[productIndex] : null);

  const updateTabUnderline = useCallback((tabEl) => {
    if (!tabEl || !tabUnderlineRef.current) return;
    tabUnderlineRef.current.style.left = `${tabEl.offsetLeft}px`;
    tabUnderlineRef.current.style.width = `${tabEl.offsetWidth}px`;
  }, []);

  const setCardView = useCallback((view) => {
    if (flightAnimRef.current) {
      try { flightAnimRef.current.cancel(); } catch (_) {}
      flightAnimRef.current = null;
    }
    if (cardRef.current && cardRef.current.getAnimations) {
      cardRef.current.getAnimations().forEach(anim => {
        try { anim.cancel(); } catch (_) {}
      });
    }

    setCurrentView(view);
    let targetAngle = 0;
    let targetTab = tabFrontRef.current;

    if (view === 'side') {
      targetAngle = 90;
      targetTab = tabSideRef.current;
    } else if (view === 'back') {
      targetAngle = 180;
      targetTab = tabBackRef.current;
    } else {
      targetAngle = 0;
      targetTab = tabFrontRef.current;
    }

    cardAngleRef.current = targetAngle;

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.75s cubic-bezier(0.2, 0.8, 0.25, 1)';
      cardRef.current.style.transform = `rotateY(${targetAngle}deg)`;
    }

    updateTabUnderline(targetTab);
  }, [updateTabUnderline]);

  // Entrance Arc Flight & Setup
  useEffect(() => {
    if (!isOpen || !prod) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';

    // Reset view to front
    cardAngleRef.current = 0;
    setCurrentView('front');
    setIsAdded(false);
    setSelectedSize(CONTENT.garmentSizes[0]);

    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
      cardRef.current.style.transform = 'rotateY(0deg)';
    }

    if (flightAnimRef.current) {
      try { flightAnimRef.current.cancel(); } catch (_) {}
      flightAnimRef.current = null;
    }

    requestAnimationFrame(() => {
      if (backdropRef.current) backdropRef.current.classList.add('visible');
      if (detailsRef.current) detailsRef.current.classList.add('visible');
      updateTabUnderline(tabFrontRef.current);
    });

    if (sourceElement) {
      sourceElement.style.visibility = 'hidden';

      if (!prefersReducedMotion && cardRef.current) {
        const rackRect = sourceElement.getBoundingClientRect();
        const stageRect = cardRef.current.getBoundingClientRect();

        const dx = (rackRect.left + rackRect.width / 2) - (stageRect.left + stageRect.width / 2);
        const dy = (rackRect.top + rackRect.height / 2) - (stageRect.top + stageRect.height / 2);
        const initialScale = Math.max(0.18, rackRect.height / (stageRect.height || 514));
        const liftY = Math.min(100, Math.max(30, 48 + Math.abs(dy) * 0.18));
        const tiltZ = dx > 0 ? -3 : 3;

        flightAnimRef.current = cardRef.current.animate([
          {
            transform: `translate3d(${dx}px, ${dy}px, 0) scale(${initialScale}) rotateY(-80deg) rotateZ(0deg)`,
            opacity: 0.75
          },
          {
            offset: 0.55,
            transform: `translate3d(${dx * 0.45}px, ${dy * 0.45 - liftY}px, 0) scale(${initialScale + (1 - initialScale) * 0.58 * 1.05}) rotateY(-36deg) rotateZ(${tiltZ}deg)`,
            opacity: 1
          },
          {
            transform: `translate3d(0, 0, 0) scale(1) rotateY(0deg) rotateZ(0deg)`,
            opacity: 1
          }
        ], {
          duration: 720,
          easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
          fill: 'forwards'
        });

        flightAnimRef.current.onfinish = () => {
          try { flightAnimRef.current.cancel(); } catch (_) {}
          if (cardRef.current && cardRef.current.getAnimations) {
            cardRef.current.getAnimations().forEach(anim => {
              try { anim.cancel(); } catch (_) {}
            });
          }
          flightAnimRef.current = null;
          if (cardRef.current) {
            cardRef.current.style.transform = `rotateY(${cardAngleRef.current}deg)`;
          }
          if (closeBtnRef.current) {
            closeBtnRef.current.focus();
          }
        };
      }
    } else if (!prefersReducedMotion && cardRef.current) {
      // Gentle fade & scale entrance if opened without rack element
      flightAnimRef.current = cardRef.current.animate([
        { transform: 'scale(0.88) rotateY(-30deg)', opacity: 0 },
        { transform: 'scale(1) rotateY(0deg)', opacity: 1 }
      ], {
        duration: 520,
        easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
        fill: 'forwards'
      });

      flightAnimRef.current.onfinish = () => {
        try { flightAnimRef.current.cancel(); } catch (_) {}
        flightAnimRef.current = null;
        if (cardRef.current) {
          cardRef.current.style.transform = `rotateY(${cardAngleRef.current}deg)`;
        }
        if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        }
      };
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (sourceElement) {
        sourceElement.style.visibility = 'visible';
      }
      if (flightAnimRef.current) {
        try { flightAnimRef.current.cancel(); } catch (_) {}
        flightAnimRef.current = null;
      }
    };
  }, [isOpen, productIndex, sourceElement, prod, updateTabUnderline]);

  const handleClose = () => {
    if (!isOpen) return;

    if (sourceElement) {
      sourceElement.style.visibility = 'visible';
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (backdropRef.current) backdropRef.current.classList.remove('visible');
    if (detailsRef.current) detailsRef.current.classList.remove('visible');

    const finishClose = () => {
      if (sourceElement) {
        sourceElement.style.visibility = 'visible';
      }
      if (cardRef.current && cardRef.current.getAnimations) {
        cardRef.current.getAnimations().forEach(anim => {
          try { anim.cancel(); } catch (_) {}
        });
      }
      document.body.style.overflow = '';
      if (onClose) {
        onClose();
      }
    };

    if (prefersReducedMotion || !cardRef.current) {
      finishClose();
      return;
    }

    if (!sourceElement) {
      flightAnimRef.current = cardRef.current.animate([
        { transform: 'scale(1) rotateY(0deg)', opacity: 1 },
        { transform: 'scale(0.9) rotateY(20deg)', opacity: 0 }
      ], {
        duration: 320,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });

      flightAnimRef.current.onfinish = () => {
        try { flightAnimRef.current.cancel(); } catch (_) {}
        flightAnimRef.current = null;
        finishClose();
      };
      return;
    }

    if (flightAnimRef.current) {
      try { flightAnimRef.current.cancel(); } catch (_) {}
      flightAnimRef.current = null;
    }

    const rackRect = sourceElement.getBoundingClientRect();
    const stageRect = cardRef.current.getBoundingClientRect();

    const dx = (rackRect.left + rackRect.width / 2) - (stageRect.left + stageRect.width / 2);
    const dy = (rackRect.top + rackRect.height / 2) - (stageRect.top + stageRect.height / 2);
    const targetScale = Math.max(0.18, rackRect.height / (stageRect.height || 514));
    const liftY = Math.min(100, Math.max(30, 48 + Math.abs(dy) * 0.18));
    const tiltZ = dx > 0 ? 3 : -3;

    flightAnimRef.current = cardRef.current.animate([
      {
        transform: `translate3d(0, 0, 0) scale(1) rotateY(${cardAngleRef.current}deg) rotateZ(0deg)`,
        opacity: 1
      },
      {
        offset: 0.45,
        transform: `translate3d(${dx * 0.45}px, ${dy * 0.45 - liftY}px, 0) scale(${targetScale + (1 - targetScale) * 0.58 * 1.05}) rotateY(-40deg) rotateZ(${tiltZ}deg)`,
        opacity: 1
      },
      {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${targetScale}) rotateY(-80deg) rotateZ(0deg)`,
        opacity: 0.7
      }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    });

    flightAnimRef.current.onfinish = () => {
      try { flightAnimRef.current.cancel(); } catch (_) {}
      if (cardRef.current && cardRef.current.getAnimations) {
        cardRef.current.getAnimations().forEach(anim => {
          try { anim.cancel(); } catch (_) {}
        });
      }
      flightAnimRef.current = null;
      finishClose();
    };
  };

  // Drag & Swipe Interaction
  const handlePointerDown = (e) => {
    if (!isOpen || !stageRef.current || !cardRef.current) return;

    if (flightAnimRef.current) {
      try { flightAnimRef.current.cancel(); } catch (_) {}
      flightAnimRef.current = null;
    }
    if (cardRef.current.getAnimations) {
      cardRef.current.getAnimations().forEach(anim => {
        try { anim.cancel(); } catch (_) {}
      });
    }

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = cardAngleRef.current;
    cardRef.current.style.transition = 'none';

    try {
      stageRef.current.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !cardRef.current) return;

    const dx = e.clientX - dragStartXRef.current;
    cardAngleRef.current = dragStartAngleRef.current - dx * 0.7;
    cardRef.current.style.transform = `rotateY(${cardAngleRef.current}deg)`;

    // Real-time tab & active face tracking
    const norm = ((cardAngleRef.current % 360) + 360) % 360;
    let liveView = 'front';
    let activeTab = tabFrontRef.current;

    if (norm >= 45 && norm < 135) {
      liveView = 'side';
      activeTab = tabSideRef.current;
    } else if (norm >= 135 && norm < 270) {
      liveView = 'back';
      activeTab = tabBackRef.current;
    }

    setCurrentView(liveView);
    updateTabUnderline(activeTab);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (stageRef.current) {
      try { stageRef.current.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    const dx = e.clientX - dragStartXRef.current;
    let targetView = currentView;

    if (Math.abs(dx) > 35) {
      if (dx < 0) {
        // Swiped left -> advance: front -> side -> back
        if (currentView === 'front') targetView = 'side';
        else if (currentView === 'side') targetView = 'back';
        else targetView = 'back';
      } else {
        // Swiped right -> reverse: back -> side -> front
        if (currentView === 'back') targetView = 'side';
        else if (currentView === 'side') targetView = 'front';
        else targetView = 'front';
      }
    } else {
      // Snap to nearest angle based on normalized rotation
      const norm = ((cardAngleRef.current % 360) + 360) % 360;
      if (norm >= 45 && norm < 135) {
        targetView = 'side';
      } else if (norm >= 135 && norm < 270) {
        targetView = 'back';
      } else {
        targetView = 'front';
      }
    }

    setCardView(targetView);
  };

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    setIsAdded(true);
    if (prod) {
      addToCart(prod, selectedSize);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  if (!isOpen || !prod) return null;

  const frontSrc = prod.front || generatePlaceholderSvg('front', prod.color);
  const sideSrc = prod.side || generatePlaceholderSvg('side', prod.color);
  const backSrc = prod.back || generatePlaceholderSvg('back', prod.color);

  const resolvedIndex = productIndex !== null && productIndex >= 0
    ? productIndex
    : (prod ? allList.findIndex(p => p.id === prod.id || p.name === prod.name) : 0);
  const counterText = `${String(Math.max(0, resolvedIndex) + 1).padStart(2, '0')} / ${String(allList.length).padStart(2, '0')}`;

  const handleImageError = (type, e) => {
    const img = e.target;
    if (img.src.includes('-tight.webp')) {
      img.src = img.src.replace('-tight.webp', '-tight.png');
    } else {
      img.onerror = null;
      img.src = generatePlaceholderSvg(type, prod.color);
    }
  };

  return (
    <div
      className="popup-backdrop active"
      id="product-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Product Details"
      tabIndex={-1}
      ref={backdropRef}
      onClick={handleBackdropClick}
    >
      <button
        className="popup-close-btn"
        id="modal-close-btn"
        aria-label="Close dialog"
        ref={closeBtnRef}
        onClick={handleClose}
      >
        ✕
      </button>

      <div className="popup-dialog" ref={dialogRef}>
        {/* Left Side: Interactive 3D Stage */}
        <div
          className="popup-stage"
          id="modal-stage"
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="stage-card-wrapper" id="modal-card" ref={cardRef}>
            <div
              className={`stage-card-face front ${currentView === 'front' ? 'active-face' : ''}`}
              id="card-face-front"
            >
              <img
                id="modal-img-front"
                src={frontSrc}
                alt="Garment front view"
                onError={e => handleImageError('front', e)}
              />
            </div>
            <div
              className={`stage-card-face side ${currentView === 'side' ? 'active-face' : ''}`}
              id="card-face-side"
            >
              <img
                id="modal-img-side"
                src={sideSrc}
                alt="Garment side view"
                onError={e => handleImageError('side', e)}
              />
            </div>
            <div
              className={`stage-card-face back ${currentView === 'back' ? 'active-face' : ''}`}
              id="card-face-back"
            >
              <img
                id="modal-img-back"
                src={backSrc}
                alt="Garment back view"
                onError={e => handleImageError('back', e)}
              />
            </div>
          </div>

          <div className="stage-hint">
            <span>← DRAG TO SPIN →</span>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Form */}
        <div className="popup-details" id="modal-details" ref={detailsRef}>
          <div className="popup-top-meta-row">
            <span className="popup-counter" id="modal-counter">
              {counterText}
            </span>
            <div className="modal-rating-badge">
              <span className="stars">★★★★★</span>
              <span className="score">4.9</span>
              <span className="count">(84 verified)</span>
            </div>
          </div>

          <h2 className="popup-title" id="modal-title">
            {prod.name}
          </h2>

          <div className="popup-price-row">
            <span className="popup-price" id="modal-price">{formatPrice(prod.numericPrice)}</span>
            <span className="installment-note">or 4 interest-free payments of {formatPrice(prod.numericPrice / 4)} with Klarna</span>
          </div>

          <div className="stock-status-pill">
            <span className="pulse-dot"></span>
            <span>In Stock — Dispatches within 24h via DHL Express</span>
          </div>

          {/* Front | Side | Back view toggle tabs */}
          <div className="view-tabs" role="tablist">
            <button
              className={`tab-btn ${currentView === 'front' ? 'active' : ''}`}
              id="tab-front"
              role="tab"
              aria-selected={currentView === 'front'}
              ref={tabFrontRef}
              onClick={() => setCardView('front')}
            >
              Front
            </button>
            <button
              className={`tab-btn ${currentView === 'side' ? 'active' : ''}`}
              id="tab-side"
              role="tab"
              aria-selected={currentView === 'side'}
              ref={tabSideRef}
              onClick={() => setCardView('side')}
            >
              Side
            </button>
            <button
              className={`tab-btn ${currentView === 'back' ? 'active' : ''}`}
              id="tab-back"
              role="tab"
              aria-selected={currentView === 'back'}
              ref={tabBackRef}
              onClick={() => setCardView('back')}
            >
              Back
            </button>
            <div className="tab-underline" id="tab-underline" ref={tabUnderlineRef}></div>
          </div>

          {/* Size Pills */}
          <div className="size-section">
            <div className="size-label-row">
              <span className="size-label">Select Size</span>
              <span className="size-fit-hint">Fit: True to size. Take your normal size.</span>
            </div>
            <div className="size-pills" id="modal-size-pills" role="radiogroup" aria-label="Select garment size">
              {CONTENT.garmentSizes.map(sz => (
                <button
                  key={sz}
                  className={`size-pill ${selectedSize === sz ? 'selected' : ''}`}
                  role="radio"
                  aria-checked={selectedSize === sz}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Add To Cart Button */}
          <button
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            id="modal-add-to-cart"
            onClick={handleAddToCart}
          >
            {isAdded ? 'Added to Bag ✓' : `Add to Bag — ${formatPrice(prod.numericPrice)}`}
          </button>

          {/* E-Commerce Guarantees Checklist */}
          <div className="modal-perks-list">
            <div className="modal-perk-item">
              <span className="check">✓</span>
              <span><strong>Free Worldwide Shipping</strong> — Insured DHL Express direct from Florence</span>
            </div>
            <div className="modal-perk-item">
              <span className="check">✓</span>
              <span><strong>30-Day Complimentary Returns</strong> — Prepaid return label included</span>
            </div>
            <div className="modal-perk-item">
              <span className="check">✓</span>
              <span><strong>Atelier Presentation</strong> — Includes custom cedar hanger & canvas travel bag</span>
            </div>
            <div className="modal-perk-item">
              <span className="check">✓</span>
              <span><strong>Lifetime Care Guarantee</strong> — Free hardware & welt seam repairs for life</span>
            </div>
          </div>

          {/* Footer Row */}
          <div className="popup-footer-row">
            <span className="footer-product-name" id="modal-footer-name">
              {prod.name}
            </span>
            <span className="footer-guarantee-tag">
              Certificate of Authenticity Included
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

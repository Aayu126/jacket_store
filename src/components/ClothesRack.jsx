import React, { useEffect, useLayoutEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { CONTENT } from '../data/content.js';
import { generatePlaceholderSvg } from '../utils/placeholderSvg.js';
import { useCurrency } from '../context/CurrencyContext.jsx';

function smoothstep(t) {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

function createInitialItems(itemList) {
  const list = itemList || CONTENT.rack;
  return list.map((prod, index) => ({
    index,
    data: prod,
    element: null,
    garmentBody: null,
    sideImg: null,
    frontImg: null,
    tagWrapper: null,
    tagCard: null,
    sideAspect: prod.sideAspect || 0.284,
    frontAspect: prod.frontAspect || 0.702,
    sideW: 80,
    frontW: 200,
    a: 0,
    v: 0,
    tagAngle: 0,
    k: 0,
    isHovered: false,
    dropY: -150,
    dropOpacity: 0,
    hasLanded: false,
    dropSettled: false
  }));
}

const ClothesRack = forwardRef(function ClothesRack({ items = CONTENT.rack, onSelectGarment, onHoverGarment }, ref) {
  const { formatPrice } = useCurrency();
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const itemsRef = useRef(null);
  if (!itemsRef.current || itemsRef.current.length !== items.length) {
    itemsRef.current = createInitialItems(items);
  }

  const rafIdRef = useRef(null);
  const lastFrameTimeRef = useRef(performance.now());
  const dropEntranceStartedRef = useRef(false);
  const dropEntranceStartTimeRef = useRef(0);
  const calculatedHeightRef = useRef(280);
  const hoveredIndexRef = useRef(-1);

  // Expose re-hang swing impulse
  useImperativeHandle(ref, () => ({
    triggerRehangImpulse: (target) => {
      let item = null;
      if (typeof target === 'number' && itemsRef.current && itemsRef.current[target]) {
        item = itemsRef.current[target];
      } else if (typeof target === 'object' && target !== null && itemsRef.current) {
        item = itemsRef.current.find(it => it.data && (it.data.id === target.id || it.data.name === target.name));
      }
      // Always restore visibility on all rack elements on rehang
      if (itemsRef.current) {
        itemsRef.current.forEach(it => {
          if (it && it.element) {
            it.element.style.visibility = 'visible';
          }
        });
      }
      if (item) {
        if (item.element) {
          item.element.style.visibility = 'visible';
        }
        const nudgeDir = Math.random() > 0.5 ? 1 : -1;
        item.v += nudgeDir * (18 + Math.random() * 8);
      }
      startLoop();
    },
    showAllGarments: () => {
      if (itemsRef.current) {
        itemsRef.current.forEach(it => {
          if (it && it.element) {
            it.element.style.visibility = 'visible';
          }
        });
      }
      startLoop();
    },
    getItemElement: (index) => itemsRef.current[index]?.element || null
  }));

  const tick = useCallback((now) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dt = (now - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = now;

    if (dt > 1.0) dt = 1.0;
    if (dt <= 0) dt = 0.001;

    let stillMoving = false;
    const currentItemsList = itemsRef.current;
    if (!currentItemsList || currentItemsList.length === 0) return;

    // 1. Process Drop-In Entrance
    if (dropEntranceStartedRef.current) {
      const elapsedSinceDrop = (now - dropEntranceStartTimeRef.current) / 1000;
      currentItemsList.forEach((item, i) => {
        if (item.dropSettled) return;

        if (prefersReducedMotion) {
          item.dropY = 0;
          item.dropOpacity = 1;
          item.dropSettled = true;
          return;
        }

        const staggerDelay = i * 0.07;
        const itemT = elapsedSinceDrop - staggerDelay;

        if (itemT < 0) {
          item.dropY = -150;
          item.dropOpacity = 0;
          stillMoving = true;
        } else if (itemT < 0.82) {
          stillMoving = true;
          const progress = itemT / 0.82;
          let y;
          if (progress < 0.65) {
            const p = progress / 0.65;
            const ease = p * p;
            y = -150 * (1 - ease) + 5 * ease;
          } else {
            const p = (progress - 0.65) / 0.35;
            const settle = 0.5 * (1 + Math.cos(p * Math.PI));
            y = 5 * settle;
          }

          item.dropY = y;
          item.dropOpacity = Math.min(1, itemT / 0.22);

          if (!item.hasLanded && progress >= 0.62) {
            item.hasLanded = true;
            const nudgeDir = (i % 2 === 0) ? 1 : -1;
            item.v += nudgeDir * (28 + (i % 3) * 6);
          }
        } else {
          item.dropY = 0;
          item.dropOpacity = 1;
          item.dropSettled = true;
        }
      });
    }

    // 2. Physics Simulation: Damped Pendulum Swing
    const kA = 32.0;
    const cA = 3.6;

    currentItemsList.forEach(item => {
      if (prefersReducedMotion) {
        item.a = 0;
        item.v = 0;
        item.tagAngle = 0;
        return;
      }

      let subDt = dt / 2;
      for (let s = 0; s < 2; s++) {
        const accel = -kA * item.a - cA * item.v;
        item.v += accel * subDt;
        item.a += item.v * subDt;
      }

      // Secondary Tag Pendulum
      const tagLagFactor = 0.28;
      item.tagAngle += (item.a - item.tagAngle) * tagLagFactor;

      if (Math.abs(item.v) > 0.008 || Math.abs(item.a) > 0.008) {
        stillMoving = true;
      } else {
        item.a = 0;
        item.v = 0;
      }
    });

    // 3. Hover Expansion & Neighbor Displacements
    const speed = 10.0;
    currentItemsList.forEach((item, index) => {
      const targetK = item.isHovered ? 1.0 : 0.0;
      if (Math.abs(item.k - targetK) > 0.001) {
        item.k += (targetK - item.k) * Math.min(1.0, speed * dt);
        stillMoving = true;
      } else {
        item.k = targetK;
      }

      const e = smoothstep(item.k);
      const currentW = item.sideW + (item.frontW - item.sideW) * e;
      const currentMargin = 18 * e;

      if (!item.element || !item.garmentBody) return;

      item.element.style.width = `${currentW}px`;
      item.element.style.marginLeft = `${currentMargin}px`;
      item.element.style.marginRight = `${currentMargin}px`;

      const liftY = -6 * e;
      const baseRotateY = -12 * (1 - e);

      item.element.style.opacity = `${item.dropOpacity}`;
      item.garmentBody.style.transform = `translate3d(0, ${item.dropY + liftY}px, 0) rotate(${item.a}deg) rotateY(${baseRotateY}deg)`;

      // 3D Photo View Morphing
      if (item.sideImg && item.frontImg) {
        if (e < 0.5) {
          const p1 = e / 0.5;
          item.sideImg.style.display = 'block';
          item.sideImg.style.transform = `translateX(-50%) perspective(900px) rotateY(${-88 * p1}deg)`;
          item.sideImg.style.opacity = '1';

          item.frontImg.style.display = 'none';
          item.frontImg.style.opacity = '0';
        } else {
          const p2 = (e - 0.5) / 0.5;
          item.sideImg.style.display = 'none';
          item.sideImg.style.opacity = '0';

          item.frontImg.style.display = 'block';
          item.frontImg.style.opacity = `${p2}`;
          item.frontImg.style.transform = `translateX(-50%) scale(${0.9 + 0.1 * p2})`;
        }
      }

      // Price Tag Lag
      if (item.tagWrapper && item.tagCard) {
        const tagTrailingLag = item.tagAngle - item.a;
        item.tagWrapper.style.transform = `rotate(${-24 + tagTrailingLag}deg)`;
        item.tagCard.style.transform = `rotate(${16 - tagTrailingLag * 0.4}deg)`;
      }
    });

    if (stillMoving) {
      rafIdRef.current = requestAnimationFrame(tick);
    } else {
      rafIdRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!rafIdRef.current) {
      lastFrameTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const updateDimensions = useCallback(() => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const curItems = itemsRef.current;
    if (!curItems || curItems.length === 0) return;

    if (screenW < 800) {
      calculatedHeightRef.current = 240;
    } else {
      const availableWidth = Math.min(screenW - 48, 1280);
      const gaps = (curItems.length - 1) * 12;
      const extraMargins = 2 * 18;

      let sumSideAspects = 0;
      let maxFrontMinusSide = 0;

      curItems.forEach(item => {
        sumSideAspects += item.sideAspect;
        const diff = item.frontAspect - item.sideAspect;
        if (diff > maxFrontMinusSide) {
          maxFrontMinusSide = diff;
        }
      });

      const totalAspectDenominator = sumSideAspects + maxFrontMinusSide;
      const targetAspect = Math.max(curItems.length * 0.35 + 0.5, totalAspectDenominator);
      const h = (availableWidth - gaps - extraMargins) / (targetAspect || 2.4);
      const maxHeight = Math.min(380, screenH * 0.42);
      calculatedHeightRef.current = Math.max(160, Math.min(h, maxHeight));
    }

    curItems.forEach(item => {
      item.sideW = calculatedHeightRef.current * item.sideAspect;
      item.frontW = calculatedHeightRef.current * item.frontAspect;
      if (item.element) {
        item.element.style.height = `${calculatedHeightRef.current}px`;
        if (item.k === 0) {
          item.element.style.width = `${item.sideW}px`;
        }
      }
    });

    startLoop();
  }, [startLoop]);

  // Initial layout & image dimension check
  useLayoutEffect(() => {
    itemsRef.current.forEach(item => {
      if (item.sideImg && item.sideImg.complete && item.sideImg.naturalWidth && item.sideImg.naturalHeight) {
        item.sideAspect = item.data.sideAspect || (item.sideImg.naturalWidth / item.sideImg.naturalHeight);
      }
      if (item.frontImg && item.frontImg.complete && item.frontImg.naturalWidth && item.frontImg.naturalHeight) {
        item.frontAspect = item.data.frontAspect || (item.frontImg.naturalWidth / item.frontImg.naturalHeight);
      }
    });

    updateDimensions();

    // Trigger drop-in entrance immediately
    if (!dropEntranceStartedRef.current) {
      dropEntranceStartedRef.current = true;
      dropEntranceStartTimeRef.current = performance.now();
    }
    startLoop();
  }, [updateDimensions, startLoop, items]);

  // Event Listeners: resize & scroll breeze
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);

    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let scrollThrottleTimer = null;

    const handleScroll = () => {
      if (scrollThrottleTimer) return;
      scrollThrottleTimer = setTimeout(() => {
        scrollThrottleTimer = null;
        const now = performance.now();
        const curY = window.scrollY;
        const dtScroll = (now - lastScrollTime) / 1000;
        lastScrollTime = now;

        if (dtScroll > 0 && curY < window.innerHeight * 0.8) {
          const dy = curY - lastScrollY;
          lastScrollY = curY;
          const vScroll = dy / dtScroll;
          const maxImpulse = 4.0;
          const impulse = Math.max(-maxImpulse, Math.min(maxImpulse, vScroll * 0.0035));

          if (Math.abs(impulse) > 0.05 && itemsRef.current) {
            itemsRef.current.forEach((item, i) => {
              const sign = (i % 2 === 0) ? 1 : -1;
              const delay = i * 0.04;
              setTimeout(() => {
                if (item) item.v += impulse * sign * (0.8 + (i % 3) * 0.2);
              }, delay * 1000);
            });
            startLoop();
          }
        } else {
          lastScrollY = curY;
        }
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [updateDimensions, startLoop]);

  const handleMouseEnter = (index) => {
    const item = itemsRef.current[index];
    if (!item || item.isHovered) return;
    item.isHovered = true;
    hoveredIndexRef.current = index;

    // Neighbor knock
    const curItems = itemsRef.current;
    if (curItems[index - 1]) curItems[index - 1].v += 30;
    if (curItems[index + 1]) curItems[index + 1].v -= 30;
    if (curItems[index - 2]) curItems[index - 2].v += 11;
    if (curItems[index + 2]) curItems[index + 2].v -= 11;

    if (onHoverGarment) {
      onHoverGarment(index, `${item.data.name} — ${formatPrice(item.data.numericPrice)}`);
    }
    startLoop();
  };

  const handleMouseLeave = (index) => {
    const item = itemsRef.current[index];
    if (!item || !item.isHovered) return;
    item.isHovered = false;
    if (hoveredIndexRef.current === index) {
      hoveredIndexRef.current = -1;
      if (onHoverGarment) {
        onHoverGarment(-1, null);
      }
    }
    startLoop();
  };

  const handleImageLoad = (index, type, e) => {
    const img = e.target;
    const item = itemsRef.current[index];
    if (!item) return;

    if (type === 'side') {
      item.sideAspect = item.data.sideAspect || (img.naturalWidth / img.naturalHeight);
    } else if (type === 'front') {
      item.frontAspect = item.data.frontAspect || (img.naturalWidth / img.naturalHeight);
    }
    updateDimensions();
  };

  const handleImageError = (index, type, color, e) => {
    const img = e.target;
    if (img.src.includes('-tight.webp')) {
      img.src = img.src.replace('-tight.webp', '-tight.png');
    } else {
      img.onerror = null;
      img.src = generatePlaceholderSvg(type, color);
    }
  };

  const handleClick = (index, e) => {
    e.preventDefault();
    const item = itemsRef.current[index];
    if (onSelectGarment && item) {
      onSelectGarment(item.data, item.element);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(index, e);
    }
  };

  return (
    <div className="rack-stage" id="rack-stage">
      {/* Chrome Clothes Rod */}
      <div className="rod-container" aria-hidden="true">
        <div className="clothes-rod">
          <div className="rod-cap left"></div>
          <div className="rod-cap right"></div>
        </div>
      </div>

      {/* Hanging Garments Row Viewport */}
      <div className="rack-scroll-viewport" id="rack-viewport" ref={viewportRef}>
        <div className="rack-track" id="rack-track" role="region" aria-label="Clothing rack row" ref={trackRef}>
          {items.map((prod, index) => {
            const sideSrc = prod.side || generatePlaceholderSvg('side', prod.color);
            const frontSrc = prod.front || generatePlaceholderSvg('front', prod.color);

            return (
              <div
                key={prod.id || prod.name}
                className="garment-item"
                tabIndex={0}
                role="button"
                aria-label={`${prod.name}, ${formatPrice(prod.numericPrice)}`}
                ref={el => {
                  if (itemsRef.current && itemsRef.current[index]) {
                    itemsRef.current[index].element = el;
                  }
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                onFocus={() => handleMouseEnter(index)}
                onBlur={() => handleMouseLeave(index)}
                onClick={e => handleClick(index, e)}
                onKeyDown={e => handleKeyDown(index, e)}
              >
                <div
                  className="garment-body"
                  ref={el => {
                    if (itemsRef.current && itemsRef.current[index]) {
                      itemsRef.current[index].garmentBody = el;
                    }
                  }}
                >
                  <div className="photo-container">
                    <img
                      className="garment-photo side"
                      src={sideSrc}
                      alt={`${prod.name} side view`}
                      loading="eager"
                      ref={el => {
                        if (itemsRef.current && itemsRef.current[index]) {
                          itemsRef.current[index].sideImg = el;
                        }
                      }}
                      onLoad={e => handleImageLoad(index, 'side', e)}
                      onError={e => handleImageError(index, 'side', prod.color, e)}
                    />
                    <img
                      className="garment-photo front"
                      src={frontSrc}
                      alt={`${prod.name} front view`}
                      loading="eager"
                      ref={el => {
                        if (itemsRef.current && itemsRef.current[index]) {
                          itemsRef.current[index].frontImg = el;
                        }
                      }}
                      onLoad={e => handleImageLoad(index, 'front', e)}
                      onError={e => handleImageError(index, 'front', prod.color, e)}
                    />
                  </div>
                  <div
                    className="price-tag-wrapper"
                    ref={el => {
                      if (itemsRef.current && itemsRef.current[index]) {
                        itemsRef.current[index].tagWrapper = el;
                      }
                    }}
                  >
                    <div className="tag-string"></div>
                    <div
                      className="tag-card"
                      ref={el => {
                        if (itemsRef.current && itemsRef.current[index]) {
                          itemsRef.current[index].tagCard = el;
                        }
                      }}
                    >
                      <div className="tag-hole"></div>
                      <div className="tag-price">{formatPrice(prod.numericPrice)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default ClothesRack;

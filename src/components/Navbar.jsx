import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';

export default function Navbar({ onOpenMenu, onSelectProduct, onNavigateToCollection, onNavigateToHome, currentPage = 'home' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, openCart } = useCart();
  const { currency, currentCurrency, changeCurrency, currencies } = useCurrency();
  const currencyMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (e) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target)) {
        setIsCurrencyOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const el = document.getElementById('hero');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    if (currentPage !== 'home' && onNavigateToHome) {
      onNavigateToHome(() => {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e) => {
    if (e) e.preventDefault();
    if (currentPage !== 'home' && onNavigateToHome) {
      onNavigateToHome(() => {
        setTimeout(scrollToTop, 60);
      });
    } else {
      scrollToTop();
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    handleHomeClick();
  };

  return (
    <>
      <header className={`site-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Left: Menu trigger & Quick Links */}
          <div className="nav-left">
            <button
              className="nav-menu-btn"
              onClick={onOpenMenu}
              aria-label="Open navigation menu"
            >
              <span className="menu-icon-bars" aria-hidden="true">
                <span className="bar top"></span>
                <span className="bar bottom"></span>
              </span>
              <span className="menu-label">Menu</span>
            </button>

            {/* Desktop Navigation Links - Shown strictly on the 1st page (Home) */}
            {currentPage === 'home' ? (
              <nav className="nav-desktop-links" aria-label="Quick Links">
                <button onClick={handleHomeClick} className="nav-link">
                  Home
                </button>
                <button onClick={() => scrollToSection('collection')} className="nav-link">
                  Collection
                </button>
                <button onClick={() => scrollToSection('craftsmanship')} className="nav-link">
                  Craftsmanship
                </button>
                <button onClick={() => scrollToSection('materials')} className="nav-link">
                  Materials
                </button>
                <button onClick={() => scrollToSection('lookbook')} className="nav-link">
                  Lookbook
                </button>
              </nav>
            ) : (
              <nav className="nav-desktop-links" aria-label="Quick Links">
                <button onClick={handleHomeClick} className="nav-link nav-back-link">
                  ← Back to Home
                </button>
              </nav>
            )}
          </div>

          {/* Center: Brand Marque */}
          <div className="nav-center">
            <a href="#hero" className="nav-brand-logo" onClick={handleLogoClick}>
              <span className="logo-main">SUEDO</span>
              <span className="logo-sub">ATELIER</span>
            </a>
          </div>

          {/* Right: Search, Currency & Cart */}
          <div className="nav-right">
            <button
              className="nav-icon-btn search-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search garments"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="search-label">Search</span>
            </button>

            {/* Interactive Currency Selector */}
            <div className="nav-currency-wrap" ref={currencyMenuRef}>
              <button
                className={`currency-pill ${isCurrencyOpen ? 'active' : ''}`}
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                aria-label={`Current currency: ${currentCurrency.code}. Click to change.`}
                aria-expanded={isCurrencyOpen}
                type="button"
              >
                <span className="currency-flag">{currentCurrency.flag}</span>
                <span className="currency-code-text">{currentCurrency.code}</span>
                <span className="currency-symbol-sub"> ({currentCurrency.symbol.trim()})</span>
                <span className="currency-chevron">▾</span>
              </button>

              {isCurrencyOpen && (
                <div className="nav-currency-dropdown" role="menu">
                  <div className="currency-dropdown-header">Store Currency</div>
                  <div className="currency-dropdown-list">
                    {Object.values(currencies).map((curr) => (
                      <button
                        key={curr.code}
                        className={`currency-dropdown-item ${currency === curr.code ? 'selected' : ''}`}
                        onClick={() => {
                          changeCurrency(curr.code);
                          setIsCurrencyOpen(false);
                        }}
                        role="menuitem"
                      >
                        <span className="flag">{curr.flag}</span>
                        <span className="name">{curr.name}</span>
                        <span className="code">{curr.code} ({curr.symbol.trim()})</span>
                        {currency === curr.code && <span className="check">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="nav-cart-btn"
              onClick={openCart}
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <span className="bag-icon-wrap">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </span>
              <span className="cart-label">Bag</span>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="search-backdrop" onClick={() => setIsSearchOpen(false)}>
          <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="search-input-row">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search silhouettes, colors (e.g. Bomber, Tobacco, Navy)..."
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-close-btn" onClick={() => setIsSearchOpen(false)}>
                ✕
              </button>
            </div>

            <div className="search-suggestions">
              <span className="sugg-label">Popular Searches:</span>
              <div className="sugg-tags">
                {['Tobacco Brown', 'Jet Black Bomber', 'Biker Navy', 'Harrington Burgundy', 'Overshirt'].map((tag) => (
                  <button
                    key={tag}
                    className="sugg-pill"
                    onClick={() => {
                      setSearchQuery(tag);
                      setIsSearchOpen(false);
                      scrollToSection('collection');
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

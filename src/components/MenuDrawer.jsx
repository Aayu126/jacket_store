import React, { useEffect } from 'react';
import { CONTENT } from '../data/content.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MenuDrawer({ isOpen, onClose, onNavigate }) {
  const { user } = useAuth();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    { num: '00', title: 'Atelier Home', target: 'hero', desc: 'Flagship showcase, hanger stage & signature edit' },
    { num: '01', title: 'The Collection', target: 'collection', desc: 'Complete 13-silhouette archive in suede, alpine down, and varsity wool' },
    { num: '02', title: 'Craftsmanship & Anatomy', target: 'craftsmanship', desc: 'Double-needle saddle stitching & Bergamo palladium' },
    { num: '03', title: 'Tuscan Materiality', target: 'materials', desc: '0.7mm buffed velour & full vegetable tannage' },
    { num: '04', title: 'Lookbook & Styling', target: 'lookbook', desc: 'Editorial visual captures from the Milan showroom' },
    { num: '05', title: 'Bespoke Sizing Guide', target: 'bespoke', desc: 'Custom measurement advisor & lifetime atelier care' },
    { num: '06', title: 'Atelier Heritage', target: 'story', desc: 'Florence 1974 to the modern global salon' },
    { num: '07', title: user ? 'Client Profile & Orders' : 'Sign In / Register', target: 'account', desc: 'Personal atelier archive, order tracking & bespoke measurements' }
  ];

  const handleLinkClick = (target) => {
    onClose();
    if (onNavigate) {
      onNavigate(target);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="menu-backdrop"
      onClick={(e) => {
        if (e.target.classList.contains('menu-backdrop')) onClose();
      }}
    >
      <div className="menu-container" role="dialog" aria-modal="true" aria-label="Atelier Navigation Menu">
        {/* Menu Top Bar */}
        <div className="menu-top-bar">
          <div className="menu-brand">SUEDO <span>ATELIER</span></div>
          <button className="menu-close-btn" onClick={onClose} aria-label="Close menu">
            <span>CLOSE</span>
            <span className="close-x">✕</span>
          </button>
        </div>

        {/* Menu Grid */}
        <div className="menu-content-grid">
          {/* Main Editorial Nav Links */}
          <nav className="menu-nav-list" aria-label="Primary Navigation">
            {navLinks.map((item) => (
              <a
                key={item.num}
                href={`#${item.target}`}
                className="menu-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.target);
                }}
              >
                <span className="menu-item-num">{item.num}</span>
                <div className="menu-item-text">
                  <span className="menu-item-title">{item.title}</span>
                  <span className="menu-item-desc">{item.desc}</span>
                </div>
                <span className="menu-item-arrow">→</span>
              </a>
            ))}
          </nav>

          {/* Right Editorial Column: Global Ateliers & Details */}
          <div className="menu-sidebar">
            <div className="menu-sidebar-section">
              <span className="sidebar-eyebrow">Flagship Ateliers</span>
              <ul className="atelier-city-list">
                {CONTENT.ateliers.map((at) => (
                  <li key={at.city} className="atelier-city-item">
                    <span className="city-name">{at.city}</span>
                    <span className="city-detail">{at.address}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="menu-sidebar-section">
              <span className="sidebar-eyebrow">Client Services</span>
              <p className="menu-contact-p">
                Private appointments, bespoke custom fits & trunk shows:
                <br />
                <a href="mailto:concierge@suedo.example" className="menu-email-link">
                  concierge@suedo.example
                </a>
              </p>
            </div>

            <div className="menu-sidebar-badge">
              <span>✦ Tailored in Florence, Italy</span>
              <span>100% Traceable European Hides</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

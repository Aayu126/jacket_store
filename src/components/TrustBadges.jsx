import React from 'react';

export default function TrustBadges() {
  const perks = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      ),
      title: 'Free Worldwide Express Shipping',
      desc: 'Insured DHL Express direct from Florence. 2–4 business days delivery with signature release.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
      ),
      title: '30-Day Complimentary Returns',
      desc: 'Prepaid return label and custom return garment packaging included in every order.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: '100% Certified Italian Suede',
      desc: 'Ethically sourced Tuscan hides. Hand-buffed velour nap with water-repellent eco shield.'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      ),
      title: 'Lifetime Atelier Guarantee',
      desc: 'Complimentary hardware, shank button, and welt seam repairs for the life of the garment.'
    }
  ];

  return (
    <section className="section-trust-badges" aria-label="E-Commerce Guarantees">
      <div className="section-container">
        <div className="trust-badges-grid">
          {perks.map((p, i) => (
            <div key={i} className="trust-badge-card">
              <div className="trust-icon-box">{p.icon}</div>
              <div className="trust-text-box">
                <h4 className="trust-title">{p.title}</h4>
                <p className="trust-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

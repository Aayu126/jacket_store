import React, { useState } from 'react';
import { CONTENT } from '../data/content.js';
import { useCurrency } from '../context/CurrencyContext.jsx';

export default function Footer({ onOpen3DModal }) {
  const { currency, changeCurrency, currencies, formatPrice } = useCurrency();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <footer className="site-footer" id="site-footer">
      <div className="section-container">
        {/* Top Brand Banner & Newsletter Offer */}
        <div className="footer-top-row">
          <div className="footer-brand-lockup">
            <h2 className="footer-logo">SUEDO</h2>
            <span className="footer-sub-logo">ATELIER · FIRENZE · 1974</span>
            <p className="footer-brand-blurb">
              The international purveyor of bespoke, unlined Tuscan lambskin outerwear. Hand-patterned and hand-buffed in Florence, delivered directly to collectors worldwide with insured express courier.
            </p>
          </div>

          {/* Footer Quick Newsletter Box */}
          <div className="footer-newsletter-wrap">
            <span className="footer-perk-tag">NEW CLIENT INCENTIVE</span>
            <h4 className="footer-newsletter-headline">Receive $30 Off Your First Order</h4>
            <p className="footer-newsletter-desc">
              Subscribe to the Florence Atelier Registry for seasonal archive allocations, private trunk show invitations, and complimentary custom sleeve hemming.
            </p>
            {subscribed ? (
              <div className="footer-newsletter-success">
                ✓ Welcome to the Atelier. Your $30 welcome voucher has been dispatched to your email.
              </div>
            ) : (
              <form className="footer-newsletter-form" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  className="footer-email-input"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className="footer-submit-btn">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Multi-Column E-Commerce Grid */}
        <div className="footer-columns-grid">
          {/* Col 1: Shop Outerwear */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop Outerwear</h4>
            <ul className="footer-links-list">
              {CONTENT.allProducts.map((jacket, idx) => (
                <li key={jacket.id || jacket.name}>
                  <button
                    className="footer-link-btn"
                    onClick={() => onOpen3DModal(jacket)}
                    title={`View ${jacket.name} in 360°`}
                  >
                    {jacket.name}
                  </button>
                </li>
              ))}
              <li><a href="#collection" className="footer-link">Suede Care Kits & Brass Brush</a></li>
              <li><a href="#collection" className="footer-link">Digital Atelier Gift Cards</a></li>
            </ul>
          </div>

          {/* Col 2: Client Concierge */}
          <div className="footer-col">
            <h4 className="footer-col-title">Customer Care</h4>
            <ul className="footer-links-list">
              <li><a href="#/checkout" className="footer-link">Payment Methods, UPI & SSL Security</a></li>
              <li><a href="#faq" className="footer-link">Order Tracking & Dispatch Status</a></li>
              <li><a href="#faq" className="footer-link">Worldwide Shipping Rates & Times</a></li>
              <li><a href="#faq" className="footer-link">30-Day Returns & Size Exchanges</a></li>
              <li><a href="#bespoke" className="footer-link">Tailored Proportions & Fit Guide</a></li>
              <li><a href="#materials" className="footer-link">Waterproofing & Suede Care Guide</a></li>
              <li><a href="#faq" className="footer-link">Frequently Asked Questions (FAQ)</a></li>
              <li><a href="mailto:concierge@suedo.example" className="footer-link">Book a Private Fitting Appointment</a></li>
            </ul>
          </div>

          {/* Col 3: The Atelier */}
          <div className="footer-col">
            <h4 className="footer-col-title">The Atelier</h4>
            <ul className="footer-links-list">
              <li><a href="#story" className="footer-link">Our Heritage Since 1974</a></li>
              <li><a href="#materials" className="footer-link">Tuscan Tanneries & Velour Nap</a></li>
              <li><a href="#craftsmanship" className="footer-link">Bespoke Anatomy & Hand Welt Stitching</a></li>
              <li><a href="#lookbook" className="footer-link">Autumn / Winter Editorial Lookbook</a></li>
              <li><a href="#story" className="footer-link">Sustainable Zero-Chromium Tanning</a></li>
              <li><a href="#reviews" className="footer-link">Client Reviews & Press Accolades</a></li>
              <li><a href="mailto:careers@suedo.example" className="footer-link">Artisan Careers & Apprenticeships</a></li>
            </ul>
          </div>

          {/* Col 4: International Salons */}
          <div className="footer-col">
            <h4 className="footer-col-title">Flagship Salons</h4>
            <ul className="footer-links-list">
              {CONTENT.ateliers.map((at) => (
                <li key={at.city} className="footer-salon-item">
                  <strong>{at.city}</strong> — {at.address}
                </li>
              ))}
            </ul>
            <div className="footer-currency-picker">
              <span className="currency-label">Store Currency:</span>
              <select
                className="currency-select"
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
                aria-label="Select store currency"
              >
                {Object.values(currencies).map((curr) => (
                  <option key={curr.code} value={curr.code} className="currency-option">
                    {curr.flag} {curr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Payment Methods & Trust Guarantees */}
        <div className="footer-middle-trust-row">
          <div className="footer-trust-chips">
            <span className="trust-chip-item">
              <span className="icon">✓</span> 100% Certified Italian Lambskin
            </span>
            <span className="trust-chip-item">
              <span className="icon">✓</span> Duties & Taxes Prepaid (DDP)
            </span>
            <span className="trust-chip-item">
              <span className="icon">✓</span> 30-Day Complimentary In-Home Trial
            </span>
            <span className="trust-chip-item">
              <span className="icon">✓</span> Lifetime Hardware & Stitch Warranty
            </span>
          </div>

          <div className="footer-payment-methods">
            <span className="payment-label">Guaranteed Safe & Secure Checkout:</span>
            <div className="payment-badges-row">
              <span className="pay-badge" title="Apple Pay">Apple Pay</span>
              <span className="pay-badge" title="Google Pay">Google Pay</span>
              <span className="pay-badge" title="Visa">VISA</span>
              <span className="pay-badge" title="Mastercard">Mastercard</span>
              <span className="pay-badge" title="American Express">AMEX</span>
              <span className="pay-badge" title="PayPal">PayPal</span>
              <span className="pay-badge" title="Klarna">Klarna (4x)</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="footer-bottom-bar">
          <div className="footer-copy">
            © {new Date().getFullYear()} Suedo Atelier Firenze S.r.l. All rights reserved. 256-Bit SSL Encrypted Checkout. Tailored in Tuscany, Italy.
          </div>

          <div className="footer-bottom-links">
            <a href="#faq" className="footer-legal-link">Privacy Policy</a>
            <span className="link-dot">·</span>
            <a href="#faq" className="footer-legal-link">Terms of Sale</a>
            <span className="link-dot">·</span>
            <a href="#faq" className="footer-legal-link">Returns & Refunds Policy</a>
            <span className="link-dot">·</span>
            <a href="#faq" className="footer-legal-link">Cookie Preferences</a>
            <span className="link-dot">·</span>
            <a href="#faq" className="footer-legal-link">Accessibility Statement</a>
          </div>

          <div className="footer-scroll-top-wrap">
            <button className="footer-back-to-top" onClick={scrollToTop} aria-label="Back to top">
              <span>Back to Top</span>
              <span className="arrow-up">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

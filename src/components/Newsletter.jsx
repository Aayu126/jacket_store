import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <section className="section-newsletter" id="newsletter">
      <div className="section-container">
        <div className="newsletter-card">
          <div className="section-eyebrow">
            <span>THE ATELIER DISPATCH</span>
            <span className="eyebrow-divider"></span>
            <span>LIMITED CUTS ONLY</span>
          </div>

          <h2 className="newsletter-title">Private Allocation & Seasonal Drops</h2>
          <p className="newsletter-subtitle">
            Because our tanneries produce limited batches of 0.7mm velour, each silhouette is produced in runs of only 25 hand-numbered garments. Join our private ledger for early release invitations and trunk show access.
          </p>

          {isSubmitted ? (
            <div className="newsletter-success">
              <span className="success-icon">✓</span>
              <span>Your invitation request has been recorded in the Florence Ledger. Welcome to Suedo Atelier.</span>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  required
                  className="newsletter-input"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="newsletter-submit-btn">
                  <span>Request Invitation</span>
                  <span className="arrow-icon">→</span>
                </button>
              </div>
              <span className="newsletter-disclaimer">
                Strictly confidential. No spam, seasonal dispatches only. You may withdraw at any moment.
              </span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

import React from 'react';

export default function CustomerReviews() {
  const reviews = [
    {
      author: 'Julian M.',
      location: 'London, UK',
      item: 'Suede Trucker Tobacco Brown',
      size: 'Size L',
      rating: 5,
      date: 'Verified Buyer · October 2026',
      title: 'The benchmark for luxury outerwear',
      body: 'I own bespoke jackets from Savile Row, but this Suedo trucker immediately became my most-worn outer layer. The lambskin nap is extraordinarily supple and the drape across the shoulders is immaculate. Delivered to Mayfair in 48 hours in a cedar hanger box.'
    },
    {
      author: 'Marcus V.',
      location: 'New York, US',
      item: 'Suede Bomber Jet Black',
      size: 'Size M',
      rating: 5,
      date: 'Verified Buyer · November 2026',
      title: 'Fits true to size with exceptional finishing',
      body: 'Pure understated luxury. The Excella silver zipper action is smooth like butter, and the unlined reverse suede breathes effortlessly over a cashmere turtleneck. The 3D turntable on the site was 100% true to how the garment looks in person.'
    },
    {
      author: 'Elena R.',
      location: 'Milan, Italy',
      item: 'Suede Harrington Jet Burgundy',
      size: 'Size S',
      rating: 5,
      date: 'Verified Buyer · November 2026',
      title: 'A true Florentine heirloom',
      body: 'The wine hue is deep and nuanced in natural light. I was caught in light rain in Brera and the water rolled right off thanks to the eco-shield treatment. Customer concierge handled my sleeve measurement with great care.'
    }
  ];

  const pressQuotes = [
    {
      quote: 'The standard for modern suede outerwear. Finishing that rivals bespoke heritage houses at three times the price.',
      publication: 'GQ MAGAZINE'
    },
    {
      quote: 'Effortless Florentine tailoring with unlined, whisper-light lambskin that feels like a second skin.',
      publication: 'VOGUE MAN'
    },
    {
      quote: 'Flawless minimalist geometry. Real horn buttons, hand-set pockets, and generational longevity.',
      publication: 'ESQUIRE'
    }
  ];

  return (
    <section className="section-reviews" id="reviews">
      <div className="section-container">
        {/* Section Header */}
        <div className="reviews-header">
          <div className="section-eyebrow">
            <span>CLIENT REVIEWS & RECOGNITION</span>
            <span className="eyebrow-divider"></span>
            <span>VERIFIED ATELIER COLLECTORS</span>
          </div>
          <h2 className="section-title">Endorsed by Connoisseurs</h2>
          <div className="reviews-summary-badge">
            <div className="stars-row">
              {'★★★★★'}
            </div>
            <span className="rating-score">4.9 / 5.0</span>
            <span className="rating-sep">·</span>
            <span className="rating-count">Based on 480+ Verified International Orders</span>
          </div>
        </div>

        {/* Press Accolades Ribbon */}
        <div className="press-strip">
          {pressQuotes.map((p, i) => (
            <div key={i} className="press-quote-box">
              <p className="press-quote-text">“{p.quote}”</p>
              <span className="press-publication">— {p.publication}</span>
            </div>
          ))}
        </div>

        {/* Customer Cards Grid */}
        <div className="reviews-cards-grid">
          {reviews.map((rev, i) => (
            <div key={i} className="review-card">
              <div className="review-top-row">
                <div className="review-stars">{'★'.repeat(rev.rating)}</div>
                <span className="review-date">{rev.date}</span>
              </div>
              <h4 className="review-title">{rev.title}</h4>
              <p className="review-body">“{rev.body}”</p>
              <div className="review-footer">
                <div className="reviewer-avatar">
                  {rev.author.charAt(0)}
                </div>
                <div className="reviewer-meta">
                  <span className="reviewer-name">{rev.author} <span className="verified-check">✓</span></span>
                  <span className="reviewer-sub">{rev.location} · {rev.item} ({rev.size})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

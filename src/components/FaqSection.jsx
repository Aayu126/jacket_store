import React, { useState } from 'react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How fast is worldwide delivery, and how will my jacket be packaged?',
      a: 'All orders are dispatched within 24 hours directly from our Florence atelier via DHL Express. Average delivery time to the United States and Canada is 2–3 business days; UK and Europe is 1–2 business days; Asia-Pacific is 3–5 business days. Every jacket is steamed, fitted onto a contoured aromatic cedar hanger, and enclosed in a tailored breathable cotton-canvas garment travel bag inside our signature rigid magnetic presentation box.'
    },
    {
      q: 'What is your return, refund, and size exchange policy?',
      a: 'We offer a 30-day complimentary return and exchange window from the date of delivery. If you wish to exchange for another silhouette or size, or request a full refund to your original payment method, simply apply the prepaid DHL return shipping label included in your box. Returns must be in unworn condition with the original atelier tag and cedar hanger.'
    },
    {
      q: 'Are customs, import duties, and local sales taxes included at checkout?',
      a: 'Yes, 100%. Suedo Atelier operates on a Delivery Duty Paid (DDP) basis for all shipments to the United States, United Kingdom, European Union, Canada, and Australia. The price displayed at checkout is all-inclusive. You will never receive an unexpected customs bill or tax charge upon delivery.'
    },
    {
      q: 'How do I choose the correct size? Does the suede stretch over time?',
      a: 'Our jackets are drafted to a modern tailored European fit: clean across the back and shoulders with comfortable ease over a fine knit or button-down shirt. Italian lambskin suede softens and conforms gently to your posture over the first few wearings, yielding a customized second-skin drape without losing silhouette shape. Consult our Tailored Proportions Advisor above or contact our concierge for bespoke sizing guidance.'
    },
    {
      q: 'Can I wear my suede jacket in the rain? How do I care for it?',
      a: 'Yes. All our full-nap skins are treated during the proprietary Florentine tanning process with an invisible, non-toxic fluorocarbon-free water-repellent eco shield. Light showers and mist will bead off harmlessly. If caught in heavy rain, allow the jacket to dry naturally on its cedar hanger at room temperature away from direct radiators, then gently brush the nap in one direction using the included brass suede brush.'
    },
    {
      q: 'What does the Lifetime Atelier Guarantee cover?',
      a: 'Every Suedo garment is cataloged in the Florence Archive with a unique serial number. Our lifetime guarantee covers complimentary repair of shank buttons, snap fastenings, zipper slider maintenance, and welt seam reinforcement. Simply reach out to concierge@suedo.example for insured courier transit to our workshop.'
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="section-faq" id="faq">
      <div className="section-container">
        <div className="faq-header">
          <div className="section-eyebrow">
            <span>CLIENT ASSISTANCE & ORDER POLICIES</span>
            <span className="eyebrow-divider"></span>
            <span>TRANSPARENT COMMERCE</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know regarding insured international transit, custom sizing, our 30-day trial guarantee, and lifetime suede preservation.
          </p>
        </div>

        <div className="faq-accordion-list">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`faq-item ${isOpen ? 'open' : ''}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                <div
                  className="faq-answer-collapse"
                  style={{ maxHeight: isOpen ? '240px' : '0' }}
                >
                  <p className="faq-answer-text">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq-contact-card">
          <div className="faq-contact-text">
            <h4>Have an individual question or require tailored styling advice?</h4>
            <p>Our Florence atelier concierge is available 7 days a week via live email, WhatsApp, or private phone consultation.</p>
          </div>
          <a href="mailto:concierge@suedo.example" className="pill-button faq-concierge-btn">
            Contact Client Concierge →
          </a>
        </div>
      </div>
    </section>
  );
}

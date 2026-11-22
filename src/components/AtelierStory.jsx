import React from 'react';
import { CONTENT } from '../data/content.js';

export default function AtelierStory() {
  return (
    <section className="section-story" id="story">
      <div className="section-container">
        <div className="story-split-grid">
          {/* Left Column: Manifesto & Heritage */}
          <div className="story-editorial-col">
            <div className="section-eyebrow">
              <span>L’ORIGINE</span>
              <span className="eyebrow-divider"></span>
              <span>EST. 1974 · FIRENZE</span>
            </div>
            <h2 className="story-quote">
              “True luxury never shouts. It lives in the quiet warmth of velvety lambskin, the tension of a hand-waxed seam, and the graceful patina of years lived well.”
            </h2>
            <div className="story-author">
              <span className="author-name">Marco & Matteo Suedo</span>
              <span className="author-title">Master Cutters & Founders, Florence</span>
            </div>

            <div className="story-paragraphs">
              <p>
                Founded in 1974 along the banks of the Arno in Florence, Suedo Atelier began as an obsessive pursuit: to elevate suede from a delicate novelty into an enduring, unlined companion garment of unmatched softness and structural integrity.
              </p>
              <p>
                Unlike mass garment factories that machine-quilt heavy stiffeners into inferior split-suedes, every Suedo jacket begins with full-thickness European hides selected by touch. We cut one jacket at a time. No shortcuts, no plastic trims, no seasonal obsolescence.
              </p>
            </div>
          </div>

          {/* Right Column: Global Ateliers Showcase */}
          <div className="story-ateliers-col">
            <h3 className="ateliers-heading">Our Global Salons</h3>
            <p className="ateliers-sub">
              Visit our master cutting rooms or schedule a private fitting with a traveling bespoke specialist.
            </p>

            <div className="ateliers-cards-stack">
              {CONTENT.ateliers.map((atelier) => (
                <div key={atelier.city} className="atelier-loc-card">
                  <div className="loc-card-header">
                    <div>
                      <h4 className="loc-city">{atelier.city}</h4>
                      <span className="loc-country">{atelier.country}</span>
                    </div>
                    <span className="loc-role">{atelier.role}</span>
                  </div>
                  <div className="loc-address-row">
                    <span className="loc-pin">📍</span>
                    <span className="loc-addr">{atelier.address}</span>
                  </div>
                  <div className="loc-footer-row">
                    <span className="loc-est">Est. {atelier.established}</span>
                    <a
                      href={`mailto:concierge@suedo.example?subject=Appointment Booking - ${atelier.city}`}
                      className="loc-book-link"
                    >
                      Request Salon Appointment →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

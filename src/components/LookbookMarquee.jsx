import React from 'react';
import { CONTENT } from '../data/content.js';

export default function LookbookMarquee({ onOpen3DModal }) {
  const allList = CONTENT.allProducts;

  const lookbookItems = [
    {
      jacket: allList[0],
      title: 'Autumn in Florence',
      location: 'Piazza del Carmine',
      caption: 'Tobacco Brown Trucker layered over merino knit',
      img: allList[0]?.front
    },
    {
      jacket: allList[1],
      title: 'Midnight in Milan',
      location: 'Brera Design District',
      caption: 'Jet Black Bomber with wool pleated trousers',
      img: allList[1]?.front
    },
    {
      jacket: allList[7], // Puffer Black
      title: 'Monochrome Alpine Loft',
      location: 'Cortina d\'Ampezzo',
      caption: 'Onyx Black Puffer in matte water-resistant technical ripstop',
      img: allList[7]?.front
    },
    {
      jacket: allList[8], // Puffer SkyBlue
      title: 'Winter Sky Terrace',
      location: 'St. Moritz Salon',
      caption: 'Sky Blue Puffer with architectural thermal baffle down',
      img: allList[8]?.front
    },
    {
      jacket: allList[10], // Varsity Brown & Sand
      title: 'Heritage Ivy League',
      location: 'Savile Row, Mayfair',
      caption: 'Varsity in espresso melton wool & sand beige leather arms',
      img: allList[10]?.front
    },
    {
      jacket: allList[12], // Varsity Emerald & White
      title: 'Collegiate Emerald Study',
      location: 'Brera Art Pavilion',
      caption: 'Emerald Green Varsity featuring twin-striped ribbed trims',
      img: allList[12]?.front
    },
    {
      jacket: allList[2],
      title: 'Rain on Savile Row',
      location: 'Mayfair, London',
      caption: 'Jet Burgundy Harrington with water-repellent finish',
      img: allList[2]?.front
    },
    {
      jacket: allList[6],
      title: 'High Desert Warmth',
      location: 'Madrid Salon',
      caption: 'Sand Beige Aviator in Spanish Merinillo nap',
      img: allList[6]?.front
    }
  ];

  return (
    <section className="section-lookbook" id="lookbook">
      <div className="lookbook-header-wrap">
        <div className="section-eyebrow">
          <span>EDITORIAL LOOKBOOK</span>
          <span className="eyebrow-divider"></span>
          <span>AUTUMN / WINTER '26</span>
        </div>
        <h2 className="section-title">The Garments in Life</h2>
        <p className="section-subtitle">
          Designed for quiet presence: moving effortlessly between atelier salons, alpine retreats, and evening engagements.
        </p>
      </div>

      {/* Marquee Viewport with Infinite Seamless Scrolling */}
      <div className="lookbook-marquee-viewport" aria-label="Visual lookbook gallery">
        <div className="lookbook-track">
          {/* Double track array for seamless infinite loop */}
          {[...lookbookItems, ...lookbookItems].map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="lookbook-card"
              onClick={() => onOpen3DModal && onOpen3DModal(item.jacket)}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${item.title}`}
            >
              <div className="lookbook-card-frame">
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="lookbook-img"
                />
                <div className="lookbook-overlay">
                  <span className="lookbook-badge">Inspect 360° View ↗</span>
                </div>
              </div>
              <div className="lookbook-meta">
                <span className="lookbook-location">{item.location}</span>
                <h4 className="lookbook-card-title">{item.title}</h4>
                <p className="lookbook-caption">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

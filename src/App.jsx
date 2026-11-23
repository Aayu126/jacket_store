import React, { useState, useEffect, useRef } from 'react';
import { CurrencyProvider } from './context/CurrencyContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import MenuDrawer from './components/MenuDrawer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Hero from './components/Hero.jsx';
import TrustBadges from './components/TrustBadges.jsx';
import HomeCollectionPreview from './components/HomeCollectionPreview.jsx';
import FullCollectionPage from './components/FullCollectionPage.jsx';
import PaymentMethodPage from './components/PaymentMethodPage.jsx';
import AccountPage from './components/AccountPage.jsx';
import CustomerReviews from './components/CustomerReviews.jsx';
import Craftsmanship from './components/Craftsmanship.jsx';
import MaterialHeritage from './components/MaterialHeritage.jsx';
import LookbookMarquee from './components/LookbookMarquee.jsx';
import BespokeGuide from './components/BespokeGuide.jsx';
import FaqSection from './components/FaqSection.jsx';
import AtelierStory from './components/AtelierStory.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';
import ProductModal from './components/ProductModal.jsx';
import { CONTENT } from './data/content.js';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'collection' | 'checkout'
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeProductIndex, setActiveProductIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceElement, setSourceElement] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rackRef = useRef(null);

  // Sync with URL hash for browser back/forward and direct links
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#/collection' || window.location.hash === '#collection-archive') {
        setCurrentPage('collection');
      } else if (window.location.hash === '#/checkout' || window.location.hash === '#checkout') {
        setCurrentPage('checkout');
      } else if (window.location.hash === '#/account' || window.location.hash === '#/login' || window.location.hash === '#account' || window.location.hash === '#login') {
        setCurrentPage('account');
      } else {
        setCurrentPage('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToPage = (page, callback = null) => {
    setCurrentPage(page);
    if (page === 'collection') {
      window.location.hash = '#/collection';
    } else if (page === 'checkout') {
      window.location.hash = '#/checkout';
    } else if (page === 'account') {
      window.location.hash = '#/account';
    } else {
      if (window.location.hash === '#/collection' || window.location.hash === '#/checkout' || window.location.hash === '#/account' || window.location.hash === '#/login') {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (callback) {
      setTimeout(callback, 100);
    }
  };

  const handleOpen3DModal = (productOrIndex, element = null) => {
    if (typeof productOrIndex === 'number') {
      const el = element || (rackRef.current ? rackRef.current.getItemElement(productOrIndex) : null);
      setActiveProductIndex(productOrIndex);
      setActiveProduct(null);
      setSourceElement(el);
    } else if (typeof productOrIndex === 'object' && productOrIndex !== null) {
      setActiveProduct(productOrIndex);
      const allList = CONTENT.allProducts || CONTENT.rack;
      const idx = allList.findIndex(p => p.id === productOrIndex.id || p.name === productOrIndex.name);
      setActiveProductIndex(idx >= 0 ? idx : 0);
      setSourceElement(element);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (sourceElement) {
      sourceElement.style.visibility = 'visible';
    }
    const closedProduct = activeProduct;
    const closedIndex = activeProductIndex;

    setIsModalOpen(false);
    setActiveProductIndex(null);
    setActiveProduct(null);
    setSourceElement(null);

    if (rackRef.current) {
      rackRef.current.showAllGarments();
      if (closedProduct) {
        rackRef.current.triggerRehangImpulse(closedProduct);
      } else if (closedIndex !== null) {
        rackRef.current.triggerRehangImpulse(closedIndex);
      }
    }
  };

  const handleSelectProduct = (product) => {
    handleOpen3DModal(product);
  };

  return (
    <CurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <div className="suedo-app">
            {/* Sticky Luxury Navbar */}
            <Navbar
              currentPage={currentPage}
              onOpenMenu={() => setIsMenuOpen(true)}
              onSelectProduct={handleSelectProduct}
              onNavigateToCollection={() => navigateToPage('collection')}
              onNavigateToAccount={() => navigateToPage('account')}
              onNavigateToHome={(cb) => navigateToPage('home', cb)}
            />

            {/* Slide-over Fullscreen Navigation Menu */}
            <MenuDrawer
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onNavigate={(target) => {
                if (target === 'collection') {
                  navigateToPage('collection');
                } else if (target === 'account') {
                  navigateToPage('account');
                } else {
                  navigateToPage('home', () => {
                    setTimeout(() => {
                      const el = document.getElementById(target);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                  });
                }
              }}
            />

            {/* Slide-over Shopping Cart Drawer */}
            <CartDrawer
              onSelectProduct={handleSelectProduct}
              onProceedToCheckout={() => navigateToPage('checkout')}
            />

            {currentPage === 'collection' ? (
              /* SEPARATE FULL COLLECTION PAGE (Shows all 13 jackets with filters) */
              <FullCollectionPage
                onOpen3DModal={(jacket) => handleOpen3DModal(jacket)}
                onBackToHome={() => navigateToPage('home')}
              />
            ) : currentPage === 'checkout' ? (
              /* DEDICATED PAYMENT METHOD & ATELIER CHECKOUT PAGE */
              <PaymentMethodPage
                onBackToHome={() => navigateToPage('home')}
                onOpen3DModal={(jacket) => handleOpen3DModal(jacket)}
              />
            ) : currentPage === 'account' ? (
              /* DEDICATED RESPONSIVE CLIENT ACCOUNT & LOGIN PAGE */
              <AccountPage
                onBackToHome={() => navigateToPage('home')}
                onOpen3DModal={(jacket) => handleOpen3DModal(jacket)}
              />
            ) : (
              /* HOME PAGE: Shows only 3 sample jackets (1 Suede, 1 Puffer, 1 Varsity) + View All Button */
              <main id="main-content">
              {/* Section 1: Hero with 60 FPS Clothes Rack Stage */}
              <Hero
                rackRef={rackRef}
                onSelectGarment={(idx, el) => handleOpen3DModal(idx, el)}
                onViewAll={() => navigateToPage('collection')}
              />

              {/* Section 2: E-Commerce Guarantees & Trust Badges */}
              <TrustBadges />

              {/* Section 3: Sample 3 Jackets Preview (Suede, Puffer, Varsity) + View All Button */}
              <HomeCollectionPreview
                onOpen3DModal={(jacket) => handleOpen3DModal(jacket)}
                onViewAll={() => navigateToPage('collection')}
              />

              {/* Section 4: Connoisseur Reviews & Editorial Accolades */}
              <CustomerReviews />

              {/* Section 5: Anatomy of Bespoke Craftsmanship */}
              <Craftsmanship
                onOpen3DModal={(jacket) => handleOpen3DModal(jacket)}
              />

              {/* Section 6: Tuscan Suede Materiality & Tanneries */}
              <MaterialHeritage />

              {/* Section 7: Editorial Lookbook & Styling Gallery */}
              <LookbookMarquee
                onOpen3DModal={(jacket) => handleOpen3DModal(jacket)}
              />

              {/* Section 8: Tailored Sizing Advisor & Lifetime Care */}
              <BespokeGuide />

              {/* Section 9: E-Commerce Client Assistance & FAQ */}
              <FaqSection />

              {/* Section 10: L'Origine - Atelier Story 1974 */}
              <AtelierStory />

              {/* Section 11: Private Drop Registry & Dispatch */}
              <Newsletter />
            </main>
          )}

          {/* Global Master E-Commerce Footer */}
          <Footer
            onOpen3DModal={(jacket) => handleOpen3DModal(jacket)}
          />

          {/* 3D Turntable Product Modal with Arc Flight */}
          <ProductModal
            isOpen={isModalOpen}
            productIndex={activeProductIndex}
            product={activeProduct}
            sourceElement={sourceElement}
            onClose={handleCloseModal}
          />
        </div>
        </CartProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}

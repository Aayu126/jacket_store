import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';

export default function CartDrawer({ onSelectProduct, onProceedToCheckout }) {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart();
  const { formatPrice } = useCurrency();
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const diff = freeShippingThreshold - cartSubtotal;

  return (
    <div
      className="cart-backdrop"
      onClick={(e) => {
        if (e.target.classList.contains('cart-backdrop')) closeCart();
      }}
    >
      <div className="cart-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Shopping Cart">
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <h3 className="cart-title">Your Shopping Bag ({cartCount})</h3>
            <button className="cart-close-btn" onClick={closeCart} aria-label="Close cart">
              ✕
            </button>
          </div>

          {/* Complimentary Shipping Tracker */}
          <div className="cart-shipping-tracker">
            <div className="shipping-text">
              {cartSubtotal >= freeShippingThreshold ? (
                <span className="shipping-unlocked">✓ Complimentary Express Courier Unlocked</span>
              ) : (
                <span>Add <strong>{formatPrice(diff)}</strong> more for complimentary express courier</span>
              )}
            </div>
            <div className="shipping-bar-track">
              <div className="shipping-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Drawer Items List */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🧥</div>
              <h4>Your Shopping Bag is Empty</h4>
              <p>Explore our signature Italian suede outerwear collection and discover your tailored fit.</p>
              <button
                className="cart-browse-btn pill-button"
                onClick={() => {
                  closeCart();
                  const el = document.getElementById('collection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Suede Collection →
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.product.name}-${item.size}`} className="cart-item-card">
                <div
                  className="cart-item-thumb"
                  onClick={() => {
                    closeCart();
                    if (onSelectProduct) onSelectProduct(item.product);
                  }}
                >
                  <img src={item.product.front} alt={item.product.name} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <h4
                      className="cart-item-name"
                      onClick={() => {
                        closeCart();
                        if (onSelectProduct) onSelectProduct(item.product);
                      }}
                    >
                      {item.product.name}
                    </h4>
                    <span className="cart-item-price">{formatPrice(item.product.numericPrice)}</span>
                  </div>
                  <div className="cart-item-meta">
                    <span className="cart-pill-tag">Size: {item.size}</span>
                    <span className="cart-color-indicator" style={{ backgroundColor: item.product.color }}></span>
                    <span className="cart-stock-hint">In Stock</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-qty-stepper">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product.name, item.size, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.product.name, item.size, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-remove-link"
                      onClick={() => removeFromCart(item.product.name, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-val">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="cart-tax-notice">✓ Free express shipping, customs & duties included worldwide</p>
            <button
              className="cart-checkout-btn"
              onClick={() => {
                closeCart();
                if (onProceedToCheckout) {
                  onProceedToCheckout();
                }
              }}
            >
              <span>🔒 Proceed to Secure Checkout</span>
              <span className="checkout-arrow">→</span>
            </button>
            <div className="cart-guarantees">
              <span>✓ 30-Day In-Home Trial</span>
              <span>✓ Free Returns & Exchanges</span>
              <span>✓ Italian Cedar Hanger Included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

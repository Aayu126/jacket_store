import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { CONTENT } from '../data/content.js';

export default function PaymentMethodPage({ onBackToHome, onOpen3DModal }) {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { currency, currentCurrency, changeCurrency, currencies, formatPrice } = useCurrency();

  // If bag is empty, provide sample garment so user can test the payment page immediately
  const sampleProduct = CONTENT.suedeProducts[0];
  const isBagEmpty = cartItems.length === 0;

  const displayItems = isBagEmpty
    ? [{ product: sampleProduct, size: 'M', quantity: 1 }]
    : cartItems;

  const rawSubtotal = isBagEmpty ? sampleProduct.numericPrice : cartSubtotal;

  // Coupon / Courtesy code
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  // Client Details Form
  const [formData, setFormData] = useState({
    firstName: 'Alexander',
    lastName: 'Vane',
    email: 'client@atelier-suedo.com',
    phone: '+91 98765 43210',
    address: '14 Kensington Palace Gardens, Suite 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: currency === 'INR' ? 'India' : 'United States',
    notes: 'Please leave with concierge if unavailable.'
  });

  // Payment Method Selection
  // When INR: default to 'upi'. When others: default to 'card'.
  const [paymentMethod, setPaymentMethod] = useState(currency === 'INR' ? 'upi' : 'card');

  // UPI Specific State
  const [upiType, setUpiType] = useState('qr'); // 'qr' | 'id' | 'apps'
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);

  // Card Specific State
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8829',
    name: 'Alexander Vane',
    expiry: '09/28',
    cvv: '•••'
  });

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Payment Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState(null);

  // Update payment method default when currency changes
  useEffect(() => {
    if (currency === 'INR') {
      setPaymentMethod('upi');
      setFormData((prev) => ({ ...prev, country: 'India', city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' }));
    } else {
      setPaymentMethod('card');
      setFormData((prev) => ({ ...prev, country: currentCurrency.name.includes('United States') ? 'United States' : currentCurrency.name, city: 'New York', state: 'NY', postalCode: '10021' }));
    }
  }, [currency]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ATELIER10' || promoCode.trim().toUpperCase() === 'SUEDO') {
      setDiscountPercent(10);
      setPromoMessage({ type: 'success', text: '✦ Courtesy Privilege Applied: 10% Off Your Atelier Order' });
    } else if (promoCode.trim().toUpperCase() === 'VIP20') {
      setDiscountPercent(20);
      setPromoMessage({ type: 'success', text: '✦ VIP Connoisseur Privilege Applied: 20% Off' });
    } else {
      setDiscountPercent(0);
      setPromoMessage({ type: 'error', text: 'Invalid invitation code. Try "ATELIER10"' });
    }
  };

  const discountAmount = Math.round(rawSubtotal * (discountPercent / 100));
  const finalTotal = rawSubtotal - discountAmount;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setProcessingStep(`Initiating 256-bit secure gateway via ${paymentMethod.toUpperCase()}...`);

    setTimeout(() => {
      setProcessingStep(
        paymentMethod === 'upi'
          ? 'Verifying NPCI UPI token authorization...'
          : 'Performing 3D-Secure bank authentication...'
      );
    }, 1100);

    setTimeout(() => {
      setProcessingStep('Authorized ✓ Generating bespoke atelier dispatch order...');
    }, 2200);

    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrderId = `SA-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderData({
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        items: displayItems,
        total: finalTotal,
        paymentMethod,
        currencyCode: currency,
        shippingTo: formData
      });
      setOrderConfirmed(true);
      if (clearCart && !isBagEmpty) clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3200);
  };

  return (
    <div className="payment-page-wrapper">
      {/* Top Header Bar */}
      <header className="payment-header-bar">
        <div className="payment-header-container">
          <button className="payment-back-btn" onClick={onBackToHome} type="button">
            <span>← Return to Atelier Home</span>
          </button>

          <div className="payment-brand-badge">
            <span className="brand-title">SUEDO</span>
            <span className="brand-subtitle">SECURE CHECKOUT & DISPATCH</span>
          </div>

          <div className="payment-security-pill">
            <span className="lock-icon">🔒</span>
            <span className="security-text">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="payment-main-container">
        {orderConfirmed && confirmedOrderData ? (
          /* ==========================================================================
             ORDER SUCCESS CONFIRMATION RECEIPT
             ========================================================================== */
          <div className="order-success-card">
            <div className="success-badge-icon">✓</div>
            <div className="success-eyebrow">ORDER CONFIRMED & COMMENCED</div>
            <h1 className="success-title">Thank You, {confirmedOrderData.shippingTo.firstName}</h1>
            <p className="success-subtitle">
              Your bespoke commission has been transmitted to our master artisans in Florence. A formal courier tracking dossier has been dispatched to <strong>{confirmedOrderData.shippingTo.email}</strong>.
            </p>

            <div className="order-details-box">
              <div className="order-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Atelier Order Reference</span>
                  <span className="meta-val highlight">{confirmedOrderData.orderId}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Commission Date</span>
                  <span className="meta-val">{confirmedOrderData.date}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Payment Settled</span>
                  <span className="meta-val payment-tag">
                    {confirmedOrderData.paymentMethod.toUpperCase()} ({formatPrice(confirmedOrderData.total)})
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Dispatch Courier</span>
                  <span className="meta-val">DHL Express Worldwide (Complimentary DDP)</span>
                </div>
              </div>

              {/* Items in Order */}
              <div className="receipt-items-list">
                <h4 className="receipt-items-heading">Commissioned Silhouettes:</h4>
                {confirmedOrderData.items.map((it, idx) => (
                  <div key={idx} className="receipt-item-row">
                    <img src={it.product.front} alt={it.product.name} className="receipt-item-thumb" />
                    <div className="receipt-item-info">
                      <span className="receipt-item-name">{it.product.name}</span>
                      <span className="receipt-item-spec">Size: {it.size} · Qty: {it.quantity} · {it.product.fabric}</span>
                    </div>
                    <span className="receipt-item-price">{formatPrice(it.product.numericPrice * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Destination Address */}
              <div className="receipt-address-box">
                <span className="address-label">Insured Delivery Destination:</span>
                <p className="address-text">
                  {confirmedOrderData.shippingTo.firstName} {confirmedOrderData.shippingTo.lastName}<br />
                  {confirmedOrderData.shippingTo.address}<br />
                  {confirmedOrderData.shippingTo.city}, {confirmedOrderData.shippingTo.state} {confirmedOrderData.shippingTo.postalCode}<br />
                  {confirmedOrderData.shippingTo.country} · Tel: {confirmedOrderData.shippingTo.phone}
                </p>
              </div>

              {/* Atelier Guarantees included in box */}
              <div className="receipt-perks-row">
                <div className="perk-box">
                  <span className="perk-icon">🌲</span>
                  <span className="perk-title">Italian Cedar Hanger</span>
                  <span className="perk-desc">Contoured aromatic cedar included with every jacket</span>
                </div>
                <div className="perk-box">
                  <span className="perk-icon">🛡️</span>
                  <span className="perk-title">30-Day In-Home Trial</span>
                  <span className="perk-desc">Try on at home; complimentary courier return pickup</span>
                </div>
                <div className="perk-box">
                  <span className="perk-icon">📜</span>
                  <span className="perk-title">Artisan Provenance Certificate</span>
                  <span className="perk-desc">Individually numbered certificate hand-signed in Italy</span>
                </div>
              </div>
            </div>

            <div className="success-actions-row">
              <button className="primary-pill-btn" onClick={onBackToHome} type="button">
                ← Return to Atelier Showcase
              </button>
              <button
                className="secondary-pill-btn"
                onClick={() => window.print()}
                type="button"
              >
                🖨️ Print Atelier Dossier & Receipt
              </button>
            </div>
          </div>
        ) : (
          /* ==========================================================================
             CHECKOUT TWO-COLUMN LAYOUT
             ========================================================================== */
          <div className="checkout-two-columns">
            {/* Left Column: Client Shipping & Dynamic Payment Methods */}
            <div className="checkout-main-col">
              {/* Currency Switching Bar with Advice */}
              <div className="currency-selector-banner">
                <div className="banner-left">
                  <span className="banner-eyebrow">STORE CURRENCY & PAYMENT GATEWAY:</span>
                  <div className="banner-active-curr">
                    <span className="flag">{currentCurrency.flag}</span>
                    <span className="code">{currentCurrency.code}</span>
                    <span className="curr-name">({currentCurrency.name})</span>
                  </div>
                </div>

                <div className="banner-right">
                  <label htmlFor="checkout-curr-select" className="curr-label">Switch Currency:</label>
                  <select
                    id="checkout-curr-select"
                    className="checkout-curr-dropdown"
                    value={currency}
                    onChange={(e) => changeCurrency(e.target.value)}
                  >
                    {Object.values(currencies).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol.trim()}) — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 1: Client Shipping & Delivery Details */}
              <div className="checkout-section-card">
                <div className="card-section-header">
                  <span className="step-num">01</span>
                  <div>
                    <h2 className="step-title">Client Information & Insured Delivery</h2>
                    <p className="step-desc">All shipments are insured for full replacement value and dispatched via express courier.</p>
                  </div>
                </div>

                <div className="checkout-form-grid">
                  <div className="form-group half">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="First Name"
                    />
                  </div>

                  <div className="form-group half">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>

                  <div className="form-group half">
                    <label>Email Address (For Tracking Dossier)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="client@domain.com"
                    />
                  </div>

                  <div className="form-group half">
                    <label>Contact Phone (For Courier Coordination)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 / +1 Contact Number"
                    />
                  </div>

                  <div className="form-group full">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Building, street and unit/flat number"
                    />
                  </div>

                  <div className="form-group third">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group third">
                    <label>State / Region</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State / Region"
                    />
                  </div>

                  <div className="form-group third">
                    <label>Postal Code / PIN</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="PIN / Postal Code"
                    />
                  </div>

                  <div className="form-group full">
                    <label>Destination Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method Selection (DYNAMICS BASED ON CURRENCY!) */}
              <div className="checkout-section-card">
                <div className="card-section-header">
                  <span className="step-num">02</span>
                  <div>
                    <h2 className="step-title">Select Payment Method</h2>
                    <p className="step-desc">
                      {currency === 'INR'
                        ? 'Optimized for India: UPI (Google Pay, PhonePe, Paytm, QR), RuPay/Visa/MasterCard, Net Banking & Concierge COD.'
                        : `Optimized for ${currentCurrency.name}: Credit/Debit Cards, Apple Pay, Google Pay, PayPal, and Regional Gateways.`}
                    </p>
                  </div>
                </div>

                {/* Payment Option Tabs */}
                <div className="payment-options-selector">
                  {/* UPI IS SHOWN AS PRIMARY WHEN CURRENCY IS INR */}
                  {currency === 'INR' ? (
                    <>
                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <span className="tab-icon">⚡</span>
                        <div className="tab-text">
                          <span className="tab-title">UPI Instant Payment</span>
                          <span className="tab-badge-accent">GPay · PhonePe · Paytm · QR</span>
                        </div>
                        <span className="tab-check">{paymentMethod === 'upi' ? '●' : '○'}</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <span className="tab-icon">💳</span>
                        <div className="tab-text">
                          <span className="tab-title">RuPay / Debit / Credit Cards</span>
                          <span className="tab-sub">All Indian & International Banks</span>
                        </div>
                        <span className="tab-check">{paymentMethod === 'card' ? '●' : '○'}</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('netbanking')}
                      >
                        <span className="tab-icon">🏦</span>
                        <div className="tab-text">
                          <span className="tab-title">Net Banking</span>
                          <span className="tab-sub">HDFC, ICICI, SBI, Axis, Kotak & 50+ Banks</span>
                        </div>
                        <span className="tab-check">{paymentMethod === 'netbanking' ? '●' : '○'}</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        <span className="tab-icon">📦</span>
                        <div className="tab-text">
                          <span className="tab-title">Atelier Inspection & Pay on Delivery</span>
                          <span className="tab-sub">Cash, UPI, or Card upon doorstep receipt</span>
                        </div>
                        <span className="tab-check">{paymentMethod === 'cod' ? '●' : '○'}</span>
                      </button>
                    </>
                  ) : (
                    /* INTERNATIONAL CURRENCIES: USD, EUR, GBP, CAD, AUD, JPY, etc. */
                    <>
                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <span className="tab-icon">💳</span>
                        <div className="tab-text">
                          <span className="tab-title">Credit or Debit Card</span>
                          <span className="tab-sub">Visa, Mastercard, Amex, JCB, Diners</span>
                        </div>
                        <span className="tab-check">{paymentMethod === 'card' ? '●' : '○'}</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'applepay' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('applepay')}
                      >
                        <span className="tab-icon"></span>
                        <div className="tab-text">
                          <span className="tab-title">Apple Pay / Google Wallet</span>
                          <span className="tab-sub">Instant 1-Click Biometric Checkout</span>
                        </div>
                        <span className="tab-check">{paymentMethod === 'applepay' ? '●' : '○'}</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('paypal')}
                      >
                        <span className="tab-icon">🅿️</span>
                        <div className="tab-text">
                          <span className="tab-title">PayPal Express</span>
                          <span className="tab-sub">Buyer Protection & 180-Day Guarantee</span>
                        </div>
                        <span className="tab-check">{paymentMethod === 'paypal' ? '●' : '○'}</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'klarna' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('klarna')}
                      >
                        <span className="tab-icon">🛍️</span>
                        <div className="tab-text">
                          <span className="tab-title">Klarna / Afterpay</span>
                          <span className="tab-sub">4 interest-free payments of {formatPrice(finalTotal / 4)}</span>
                        </div>
                        <span className="tab-check">{paymentMethod === 'klarna' ? '●' : '○'}</span>
                      </button>

                      {/* Regional options depending on country */}
                      {currency === 'EUR' && (
                        <button
                          type="button"
                          className={`payment-tab-btn ${paymentMethod === 'sepa' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('sepa')}
                        >
                          <span className="tab-icon">🇪🇺</span>
                          <div className="tab-text">
                            <span className="tab-title">SEPA / iDEAL / Sofort</span>
                            <span className="tab-sub">Direct European Bank Clearing</span>
                          </div>
                          <span className="tab-check">{paymentMethod === 'sepa' ? '●' : '○'}</span>
                        </button>
                      )}

                      {currency === 'GBP' && (
                        <button
                          type="button"
                          className={`payment-tab-btn ${paymentMethod === 'bacs' ? 'active' : ''}`}
                          onClick={() => setPaymentMethod('bacs')}
                        >
                          <span className="tab-icon">🇬🇧</span>
                          <div className="tab-text">
                            <span className="tab-title">UK Faster Payments / BACS</span>
                            <span className="tab-sub">Direct London Clearing</span>
                          </div>
                          <span className="tab-check">{paymentMethod === 'bacs' ? '●' : '○'}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Sub-form based on active method */}
                <div className="active-method-container">
                  {/* UPI VIEW (INR) */}
                  {paymentMethod === 'upi' && (
                    <div className="method-subform upi-subform">
                      <div className="upi-type-tabs">
                        <button
                          type="button"
                          className={`upi-sub-btn ${upiType === 'qr' ? 'active' : ''}`}
                          onClick={() => setUpiType('qr')}
                        >
                          <span>📱 Instant QR Scanner</span>
                        </button>
                        <button
                          type="button"
                          className={`upi-sub-btn ${upiType === 'id' ? 'active' : ''}`}
                          onClick={() => setUpiType('id')}
                        >
                          <span>@ Enter UPI ID / VPA</span>
                        </button>
                        <button
                          type="button"
                          className={`upi-sub-btn ${upiType === 'apps' ? 'active' : ''}`}
                          onClick={() => setUpiType('apps')}
                        >
                          <span>⚡ One-Click UPI Apps</span>
                        </button>
                      </div>

                      {upiType === 'qr' && (
                        <div className="upi-qr-card">
                          <div className="qr-wrapper">
                            {/* Realistic SVG UPI QR Code representation */}
                            <svg className="upi-qr-code" viewBox="0 0 160 160" width="160" height="160">
                              <rect width="160" height="160" fill="#ffffff" rx="8" />
                              {/* QR Markers Top-Left */}
                              <rect x="12" y="12" width="40" height="40" fill="#141413" rx="4" />
                              <rect x="20" y="20" width="24" height="24" fill="#ffffff" />
                              <rect x="26" y="26" width="12" height="12" fill="#141413" />
                              {/* QR Markers Top-Right */}
                              <rect x="108" y="12" width="40" height="40" fill="#141413" rx="4" />
                              <rect x="116" y="20" width="24" height="24" fill="#ffffff" />
                              <rect x="122" y="26" width="12" height="12" fill="#141413" />
                              {/* QR Markers Bottom-Left */}
                              <rect x="12" y="108" width="40" height="40" fill="#141413" rx="4" />
                              <rect x="20" y="116" width="24" height="24" fill="#ffffff" />
                              <rect x="26" y="122" width="12" height="12" fill="#141413" />
                              {/* Pixel Pattern Data */}
                              <rect x="60" y="16" width="8" height="8" fill="#141413" />
                              <rect x="76" y="16" width="8" height="8" fill="#141413" />
                              <rect x="68" y="28" width="8" height="8" fill="#141413" />
                              <rect x="88" y="28" width="8" height="8" fill="#141413" />
                              <rect x="60" y="44" width="8" height="8" fill="#141413" />
                              <rect x="76" y="44" width="16" height="8" fill="#141413" />
                              <rect x="16" y="60" width="12" height="8" fill="#141413" />
                              <rect x="36" y="60" width="8" height="8" fill="#141413" />
                              <rect x="52" y="60" width="16" height="8" fill="#141413" />
                              <rect x="76" y="60" width="8" height="8" fill="#141413" />
                              <rect x="92" y="60" width="16" height="8" fill="#141413" />
                              <rect x="116" y="60" width="8" height="8" fill="#141413" />
                              <rect x="132" y="60" width="12" height="8" fill="#141413" />
                              {/* Central Atelier Monogram Emblem */}
                              <rect x="64" y="64" width="32" height="32" fill="#141413" rx="4" />
                              <text x="80" y="85" fill="#fcfbf9" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">SA</text>
                              {/* Bottom pixels */}
                              <rect x="60" y="104" width="8" height="8" fill="#141413" />
                              <rect x="76" y="104" width="8" height="8" fill="#141413" />
                              <rect x="68" y="116" width="16" height="8" fill="#141413" />
                              <rect x="92" y="116" width="8" height="8" fill="#141413" />
                              <rect x="60" y="132" width="12" height="8" fill="#141413" />
                              <rect x="80" y="132" width="8" height="8" fill="#141413" />
                              <rect x="104" y="104" width="12" height="8" fill="#141413" />
                              <rect x="124" y="104" width="16" height="8" fill="#141413" />
                              <rect x="108" y="120" width="8" height="8" fill="#141413" />
                              <rect x="124" y="128" width="16" height="8" fill="#141413" />
                            </svg>
                            <span className="qr-timer">Expires in 09:48</span>
                          </div>

                          <div className="qr-info-column">
                            <div className="upi-merchant-badge">
                              <span className="badge-verified">✓ Verified Merchant:</span>
                              <strong> SUEDO ATELIER PRIVATE LIMITED</strong>
                            </div>
                            <p className="qr-inst">
                              Open any UPI app on your mobile device (<strong>Google Pay, PhonePe, Paytm, CRED, BHIM</strong>) and scan the QR code to complete immediate settlement.
                            </p>
                            <div className="upi-vpa-copy-row">
                              <span className="vpa-text">UPI ID: <code>suedoatelier@icici</code></span>
                              <button
                                className="copy-btn"
                                type="button"
                                onClick={() => alert('UPI ID copied to clipboard: suedoatelier@icici')}
                              >
                                Copy ID
                              </button>
                            </div>
                            <div className="upi-app-logos-row">
                              <span className="app-badge">GPay</span>
                              <span className="app-badge">PhonePe</span>
                              <span className="app-badge">Paytm</span>
                              <span className="app-badge">BHIM</span>
                              <span className="app-badge">CRED</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {upiType === 'id' && (
                        <div className="upi-id-box">
                          <label className="input-label">Enter Your Virtual Payment Address (VPA / UPI ID)</label>
                          <div className="upi-input-row">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                setUpiVerified(false);
                              }}
                              placeholder="e.g. yourname@okaxis, 9876543210@paytm, name@ibl"
                            />
                            <button
                              type="button"
                              className="verify-upi-btn"
                              onClick={() => {
                                if (upiId.includes('@')) {
                                  setUpiVerified(true);
                                } else {
                                  alert('Please enter a valid UPI ID containing "@" (e.g. mobile@upi, name@okhdfcbank)');
                                }
                              }}
                            >
                              {upiVerified ? 'Verified ✓' : 'Verify ID'}
                            </button>
                          </div>
                          {upiVerified && (
                            <p className="upi-verify-success">
                              ✓ UPI Handle Verified: <strong>{upiId}</strong>. A payment request of {formatPrice(finalTotal)} will be sent to your UPI app.
                            </p>
                          )}
                        </div>
                      )}

                      {upiType === 'apps' && (
                        <div className="upi-apps-grid">
                          {[
                            { name: 'Google Pay', icon: '🟢', handle: 'GPay Mobile Deep Link' },
                            { name: 'PhonePe', icon: '🟣', handle: 'PhonePe Instant Gateway' },
                            { name: 'Paytm UPI', icon: '🔵', handle: 'Paytm Payments Bank UPI' },
                            { name: 'CRED UPI', icon: '⚫', handle: 'CRED 100% Cash-back Gateway' }
                          ].map((app) => (
                            <div key={app.name} className="upi-app-card" onClick={() => alert(`Launching ${app.name} deep-link for ${formatPrice(finalTotal)}`)}>
                              <span className="app-card-icon">{app.icon}</span>
                              <div className="app-card-info">
                                <span className="app-card-name">{app.name}</span>
                                <span className="app-card-handle">{app.handle}</span>
                              </div>
                              <span className="app-card-arrow">Pay →</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CREDIT & DEBIT CARD VIEW */}
                  {paymentMethod === 'card' && (
                    <div className="method-subform card-subform">
                      <div className="card-input-grid">
                        <div className="form-group full">
                          <label>Card Number</label>
                          <div className="card-input-with-brands">
                            <input
                              type="text"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                              placeholder="4532 •••• •••• ••••"
                            />
                            <div className="card-brand-icons">
                              {currency === 'INR' && <span className="brand-tag">RuPay</span>}
                              <span className="brand-tag">VISA</span>
                              <span className="brand-tag">MasterCard</span>
                              <span className="brand-tag">AMEX</span>
                            </div>
                          </div>
                        </div>

                        <div className="form-group full">
                          <label>Cardholder Name (as printed on card)</label>
                          <input
                            type="text"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                            placeholder="Name on card"
                          />
                        </div>

                        <div className="form-group half">
                          <label>Expiration Date</label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM / YY"
                          />
                        </div>

                        <div className="form-group half">
                          <label>Security Code (CVV / CVC)</label>
                          <input
                            type="password"
                            maxLength="4"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            placeholder="3 or 4 digits"
                          />
                        </div>
                      </div>
                      <p className="security-notice">
                        🔒 Transactions are processed over a PCI-DSS Level 1 certified TLS 1.3 encrypted connection. Card information is never stored unencrypted.
                      </p>
                    </div>
                  )}

                  {/* NET BANKING (INR) */}
                  {paymentMethod === 'netbanking' && (
                    <div className="method-subform netbanking-subform">
                      <label className="input-label">Select Your Banking Institution:</label>
                      <div className="bank-options-grid">
                        {[
                          { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
                          { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
                          { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
                          { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
                          { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK' },
                          { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' }
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            className={`bank-pill-btn ${selectedBank === b.id ? 'active' : ''}`}
                            onClick={() => setSelectedBank(b.id)}
                          >
                            <span className="bank-code">{b.code}</span>
                            <span className="bank-name">{b.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="other-banks-row">
                        <label>Or select from 50+ other authorized banks:</label>
                        <select className="bank-select-dropdown" defaultValue="other">
                          <option value="other">Bank of Baroda / Union Bank / Canara Bank / IndusInd...</option>
                          <option value="bob">Bank of Baroda</option>
                          <option value="indus">IndusInd Bank</option>
                          <option value="yes">Yes Bank</option>
                          <option value="federal">Federal Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* CASH ON DELIVERY / CONCIERGE (INR) */}
                  {paymentMethod === 'cod' && (
                    <div className="method-subform cod-subform">
                      <div className="cod-highlight-box">
                        <span className="cod-icon">🤝</span>
                        <div className="cod-info">
                          <h4>White-Glove Atelier Pay on Delivery</h4>
                          <p>
                            Experience the garment in person at your residence. You may inspect the craftsmanship, calibrated nap, and tailored fit before tendering payment.
                          </p>
                          <ul className="cod-perks">
                            <li>✓ Pay via UPI QR on courier's handheld terminal</li>
                            <li>✓ Credit / Debit Card swipe on delivery supported</li>
                            <li>✓ Cash tendered up to ₹50,000 RBI compliance</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APPLE PAY / GOOGLE WALLET */}
                  {paymentMethod === 'applepay' && (
                    <div className="method-subform applepay-subform">
                      <div className="wallet-card">
                        <div className="wallet-logo"> Pay & Google Pay</div>
                        <p>Complete your commission instantly using Touch ID, Face ID, or your biometric Google account passkey.</p>
                        <button
                          type="button"
                          className="apple-pay-cta"
                          onClick={handleProcessPayment}
                        >
                          <span>Pay with Pay ({formatPrice(finalTotal)})</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PAYPAL */}
                  {paymentMethod === 'paypal' && (
                    <div className="method-subform paypal-subform">
                      <div className="paypal-card">
                        <span className="paypal-logo">PayPal</span>
                        <p>You will be redirected to PayPal's secure portal to authorize payment with your PayPal balance or connected bank account.</p>
                        <button
                          type="button"
                          className="paypal-cta"
                          onClick={handleProcessPayment}
                        >
                          <span>Check out with PayPal</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* KLARNA / AFTERPAY */}
                  {paymentMethod === 'klarna' && (
                    <div className="method-subform klarna-subform">
                      <div className="klarna-plan-card">
                        <span className="klarna-logo">Klarna.</span>
                        <h4>4 Interest-Free Installments</h4>
                        <div className="installments-timeline">
                          <div className="inst-step">
                            <span className="step-circle active">1</span>
                            <span className="step-cost">{formatPrice(finalTotal / 4)}</span>
                            <span className="step-when">Today</span>
                          </div>
                          <div className="inst-step">
                            <span className="step-circle">2</span>
                            <span className="step-cost">{formatPrice(finalTotal / 4)}</span>
                            <span className="step-when">2 Weeks</span>
                          </div>
                          <div className="inst-step">
                            <span className="step-circle">3</span>
                            <span className="step-cost">{formatPrice(finalTotal / 4)}</span>
                            <span className="step-when">4 Weeks</span>
                          </div>
                          <div className="inst-step">
                            <span className="step-circle">4</span>
                            <span className="step-cost">{formatPrice(finalTotal / 4)}</span>
                            <span className="step-when">6 Weeks</span>
                          </div>
                        </div>
                        <p className="klarna-note">0% APR. No hidden fees or interest charges. Instant credit decision with zero impact to credit score.</p>
                      </div>
                    </div>
                  )}

                  {/* SEPA / EUROPE */}
                  {paymentMethod === 'sepa' && (
                    <div className="method-subform sepa-subform">
                      <div className="form-group full">
                        <label>IBAN Number</label>
                        <input type="text" placeholder="DE89 3704 0044 0532 0130 00" />
                      </div>
                      <div className="form-group full">
                        <label>Bank Identifier Code (BIC / SWIFT)</label>
                        <input type="text" placeholder="DEUTDEDDFXX" />
                      </div>
                      <p className="security-notice">SEPA direct bank clearance regulated by the European Central Bank.</p>
                    </div>
                  )}

                  {/* UK BACS */}
                  {paymentMethod === 'bacs' && (
                    <div className="method-subform sepa-subform">
                      <div className="form-group half">
                        <label>Sort Code</label>
                        <input type="text" placeholder="20-00-00" />
                      </div>
                      <div className="form-group half">
                        <label>UK Account Number</label>
                        <input type="text" placeholder="12345678" />
                      </div>
                      <p className="security-notice">Processed via UK Faster Payments (instant London settlement).</p>
                    </div>
                  )}
                </div>

                {/* Final Submit Payment Button */}
                <div className="submit-payment-row">
                  <button
                    type="button"
                    className="authorize-payment-btn"
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="spinner-text">
                        <span className="inline-spinner"></span>
                        {processingStep}
                      </span>
                    ) : (
                      <>
                        <span className="lock-tag">🔒</span>
                        <span>Authorize Payment · {formatPrice(finalTotal)}</span>
                        <span className="btn-arrow">→</span>
                      </>
                    )}
                  </button>
                  <span className="charge-note">
                    You will receive an instant confirmation SMS & tracking dossier at <strong>{formData.email}</strong>.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Dossier & Guarantees */}
            <aside className="checkout-summary-col">
              <div className="order-summary-card">
                <div className="summary-card-header">
                  <h3 className="summary-title">Commission Summary</h3>
                  <span className="items-count-tag">{displayItems.reduce((acc, i) => acc + i.quantity, 0)} Silhouettes</span>
                </div>

                {/* Items in bag */}
                <div className="summary-items-scroll">
                  {displayItems.map((item, idx) => (
                    <div key={`${item.product.name}-${item.size}-${idx}`} className="summary-item-card">
                      <div
                        className="summary-thumb-box"
                        onClick={() => onOpen3DModal && onOpen3DModal(item.product)}
                        title="Click to view 3D turntable"
                      >
                        <img src={item.product.front} alt={item.product.name} />
                      </div>
                      <div className="summary-item-text">
                        <h4 className="item-title">{item.product.name}</h4>
                        <div className="item-specs">
                          <span className="spec-tag">Size: {item.size}</span>
                          <span className="spec-tag">Qty: {item.quantity}</span>
                          <span className="color-dot" style={{ backgroundColor: item.product.color }}></span>
                        </div>
                        <div className="item-price-row">
                          <span className="item-price-val">{formatPrice(item.product.numericPrice * item.quantity)}</span>
                          <span className="item-craft-tag">{item.product.fabric.split(' ')[0]} Suede</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Privileged Invitation / Courtesy Code */}
                <form className="promo-code-form" onSubmit={handleApplyPromo}>
                  <div className="promo-input-row">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Courtesy Code (Try ATELIER10)"
                    />
                    <button type="submit" className="apply-promo-btn">Apply</button>
                  </div>
                  {promoMessage && (
                    <span className={`promo-status-msg ${promoMessage.type}`}>
                      {promoMessage.text}
                    </span>
                  )}
                </form>

                {/* Price Calculations */}
                <div className="summary-totals-table">
                  <div className="totals-row">
                    <span className="lbl">Silhouettes Subtotal</span>
                    <span className="val">{formatPrice(rawSubtotal)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="totals-row discount-row">
                      <span className="lbl">Privileged Courtesy ({discountPercent}% Off)</span>
                      <span className="val">−{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="totals-row">
                    <span className="lbl">Worldwide Express Courier</span>
                    <span className="val free-tag">FREE (COMPLIMENTARY)</span>
                  </div>

                  <div className="totals-row">
                    <span className="lbl">Customs, Duties & Tariffs (DDP)</span>
                    <span className="val free-tag">PRE-PAID & INCLUDED</span>
                  </div>

                  <div className="totals-row total-highlight-row">
                    <span className="lbl">Total Payable ({currency})</span>
                    <span className="val">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Atelier Standard Inclusions */}
                <div className="summary-guarantees-list">
                  <div className="guarantee-row">
                    <span className="g-icon">🛡️</span>
                    <div>
                      <strong>30-Day In-Home Trial</strong>
                      <p>Experience the leather at your home. Free exchanges & courier returns.</p>
                    </div>
                  </div>

                  <div className="guarantee-row">
                    <span className="g-icon">🌲</span>
                    <div>
                      <strong>Aromatic Cedar Hanger</strong>
                      <p>Full-shoulder contoured Italian cedar hanger provided with each coat.</p>
                    </div>
                  </div>

                  <div className="guarantee-row">
                    <span className="g-icon">🏛️</span>
                    <div>
                      <strong>Handcrafted in Florence</strong>
                      <p>100% genuine Tuscan vegetable-tanned hides and palladium hardware.</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

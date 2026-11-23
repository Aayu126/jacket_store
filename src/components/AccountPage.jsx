import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';

export default function AccountPage({ onBackToHome, onOpen3DModal }) {
  const { user, isLoggedIn, login, loginAsDemo, loginWithGoogle, loginWithApple, signup, logout, updateMeasurements, updateAddress } = useAuth();
  const { formatPrice } = useCurrency();

  // Non-logged-in tab: 'login' | 'register'
  const [authTab, setAuthTab] = useState('login');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSize, setRegSize] = useState('L');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Logged-in profile tab: 'orders' | 'measurements' | 'address' | 'privileges'
  const [activeProfileTab, setActiveProfileTab] = useState('orders');

  // Measurement edit state
  const [measurements, setMeasurements] = useState(() => user?.measurements || {
    chest: '40"',
    shoulders: '18.5"',
    sleeves: '34"',
    height: "6'0\"",
    fitPreference: 'Tailored Slim'
  });
  const [measurementSaved, setMeasurementSaved] = useState(false);

  // Address edit state
  const [addressData, setAddressData] = useState(() => user?.shippingAddress || {
    address: '742 Evergreen Terrace, Suite 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10012',
    country: 'United States'
  });
  const [addressSaved, setAddressSaved] = useState(false);

  // Voucher copy state
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter both your email address and password.');
      return;
    }
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setAuthSuccess('Welcome back.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!regName || !regEmail || !regPassword) {
      setAuthError('Please complete all required fields.');
      return;
    }
    const res = signup({
      name: regName,
      email: regEmail,
      phone: regPhone,
      size: regSize,
      password: regPassword
    });
    if (res.success) {
      setAuthSuccess('Your account has been created successfully.');
    }
  };

  const handleSaveMeasurements = (e) => {
    e.preventDefault();
    updateMeasurements(measurements);
    setMeasurementSaved(true);
    setTimeout(() => setMeasurementSaved(false), 2500);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    updateAddress(addressData);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2500);
  };

  const copyVoucherCode = (code) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedVoucher(true);
      setTimeout(() => setCopiedVoucher(false), 2500);
    } catch (_) {}
  };

  return (
    <div className="account-page-wrapper">
      {/* Top Header Bar */}
      <nav className="account-header-bar" aria-label="Account Navigation">
        <div className="account-header-container">
          <button
            type="button"
            className="account-back-btn"
            onClick={onBackToHome}
            aria-label="Return to store home"
          >
            ← Back to Store
          </button>
          <div className="account-brand-badge">
            <span className="brand-title">SUEDO</span>
            <span className="brand-sub">ACCOUNT</span>
          </div>
          <div className="account-header-status">
            {isLoggedIn ? (
              <span className="logged-badge">
                <span className="status-dot"></span> Active Session
              </span>
            ) : (
              <span className="guest-badge">Guest Session</span>
            )}
          </div>
        </div>
      </nav>

      <main className="account-main-content">
        {!isLoggedIn ? (
          /* ==========================================================================
             STATE A: AUTHENTICATION / LOGIN / REGISTER
             ========================================================================== */
          <div className="auth-card-container">
            <h1 className="auth-title">{authTab === 'login' ? 'Sign In' : 'Create Account'}</h1>
            <p className="auth-subtitle">
              {authTab === 'login'
                ? 'Welcome back. Enter your email and password to access your account.'
                : 'Create an account to manage your orders and saved details.'}
            </p>

            {/* Switcher Tabs */}
            <div className="auth-tabs-nav" role="tablist">
              <button
                type="button"
                className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                role="tab"
                aria-selected={authTab === 'login'}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
                onClick={() => { setAuthTab('register'); setAuthError(''); }}
                role="tab"
                aria-selected={authTab === 'register'}
              >
                Create Account
              </button>
            </div>

            {authError && <div className="auth-alert error-alert" role="alert">{authError}</div>}
            {authSuccess && <div className="auth-alert success-alert" role="status">{authSuccess}</div>}

            {authTab === 'login' ? (
              /* --- SIGN IN FORM --- */
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <div className="label-with-link">
                    <label htmlFor="login-password">Password</label>
                    <a href="#faq" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('For password reset assistance, please contact support@suedo.com'); }}>
                      Forgot?
                    </a>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Enter your password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="auth-submit-btn luxury-submit-btn">
                  <span>Sign In</span>
                  <span className="btn-arrow-icon" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </span>
                </button>
              </form>
            ) : (
              /* --- CREATE ACCOUNT FORM --- */
              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label htmlFor="reg-name">Full Name</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="reg-email">Email Address</label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-phone">Phone Number (Optional)</label>
                    <input
                      id="reg-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="reg-size">Size Preference</label>
                    <select
                      id="reg-size"
                      value={regSize}
                      onChange={(e) => setRegSize(e.target.value)}
                    >
                      <option value="S">Small (EU 46 / US 36)</option>
                      <option value="M">Medium (EU 48 / US 38)</option>
                      <option value="L">Large (EU 50 / US 40)</option>
                      <option value="XL">Extra Large (EU 52 / US 42)</option>
                      <option value="XXL">Double Extra Large (EU 54 / US 44)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-password">Create Password</label>
                    <input
                      id="reg-password"
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn luxury-submit-btn">
                  <span>Create Account</span>
                  <span className="btn-arrow-icon" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </span>
                </button>
              </form>
            )}

            {/* DOWN-SIDE Social Authentication */}
            <div className="auth-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="social-auth-grid">
              <button
                type="button"
                className="social-auth-btn google-auth-btn"
                onClick={() => {
                  setAuthError('');
                  const res = loginWithGoogle();
                  if (res?.success) setAuthSuccess('Signed in with Google successfully.');
                }}
                aria-label="Continue with Google"
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className="social-auth-btn apple-auth-btn"
                onClick={() => {
                  setAuthError('');
                  const res = loginWithApple();
                  if (res?.success) setAuthSuccess('Signed in with Apple successfully.');
                }}
                aria-label="Continue with Apple"
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.88c.61-.74 1.02-1.77.91-2.8-.88.04-1.95.59-2.58 1.33-.55.64-1.03 1.68-.9 2.69 1 .08 2-.48 2.57-1.22z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Demo Account Access */}
            {authTab === 'login' && (
              <div className="demo-login-box">
                <div className="demo-box-divider"><span>OR QUICK PREVIEW</span></div>
                <button
                  type="button"
                  className="demo-login-btn"
                  onClick={loginAsDemo}
                >
                  ✨ Try Demo Account
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ==========================================================================
             STATE B: AUTHENTICATED PROFILE & ATELIER DASHBOARD
             ========================================================================== */
          <div className="profile-dashboard-container">
            {/* Collector Banner Header */}
            <div className="profile-hero-card">
              <div className="profile-hero-main">
                <div className="avatar-monogram" aria-hidden="true">
                  {user.avatarInitials || 'SA'}
                </div>
                <div className="profile-identity">
                  <div className="profile-tier-badge">
                    <span className="star-icon">★</span> {user.tier || 'Florence Atelier Guild'}
                  </div>
                  <h1 className="profile-user-name">{user.name}</h1>
                  <div className="profile-meta-line">
                    <span>{user.email}</span>
                    <span className="meta-sep">·</span>
                    <span>Account #{user.id}</span>
                    <span className="meta-sep">·</span>
                    <span>Joined {user.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="profile-hero-actions">
                <button
                  type="button"
                  className="profile-logout-btn"
                  onClick={logout}
                  aria-label="Log out of atelier session"
                >
                  Sign Out ⎋
                </button>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="profile-nav-tabs" role="tablist">
              <button
                type="button"
                className={`profile-tab-item ${activeProfileTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveProfileTab('orders')}
                role="tab"
                aria-selected={activeProfileTab === 'orders'}
              >
                <span>Orders & Commissions</span>
                <span className="tab-badge">{user.orders ? user.orders.length : 0}</span>
              </button>
              <button
                type="button"
                className={`profile-tab-item ${activeProfileTab === 'measurements' ? 'active' : ''}`}
                onClick={() => setActiveProfileTab('measurements')}
                role="tab"
                aria-selected={activeProfileTab === 'measurements'}
              >
                <span>Bespoke Measurements</span>
              </button>
              <button
                type="button"
                className={`profile-tab-item ${activeProfileTab === 'address' ? 'active' : ''}`}
                onClick={() => setActiveProfileTab('address')}
                role="tab"
                aria-selected={activeProfileTab === 'address'}
              >
                <span>Shipping Address</span>
              </button>
              <button
                type="button"
                className={`profile-tab-item ${activeProfileTab === 'privileges' ? 'active' : ''}`}
                onClick={() => setActiveProfileTab('privileges')}
                role="tab"
                aria-selected={activeProfileTab === 'privileges'}
              >
                <span>Collector Privileges</span>
              </button>
            </div>

            {/* Profile Tab Contents */}
            <div className="profile-content-area">
              {activeProfileTab === 'orders' && (
                /* --- TAB 1: ORDERS & COMMISSIONS --- */
                <div className="profile-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Order Archive & Commission Tracking</h2>
                      <p className="panel-desc">Insured express shipments dispatched from our Florence workshop.</p>
                    </div>
                  </div>

                  {!user.orders || user.orders.length === 0 ? (
                    <div className="empty-orders-state">
                      <div className="empty-icon">🧥</div>
                      <h3>No Commissions On Record</h3>
                      <p>Your commissioned outerwear pieces will appear here with live tracking dossiers once reserved.</p>
                      <button type="button" className="action-pill-btn" onClick={onBackToHome}>
                        Explore Available Silhouettes →
                      </button>
                    </div>
                  ) : (
                    <div className="orders-cards-list">
                      {user.orders.map((order) => (
                        <div key={order.id} className="order-dossier-card">
                          <div className="order-dossier-header">
                            <div className="order-id-block">
                              <span className="order-number">{order.id}</span>
                              <span className="order-date">{order.date}</span>
                            </div>
                            <div className="order-status-pill">
                              <span className="status-ping"></span>
                              <span>{order.status}</span>
                            </div>
                          </div>

                          <div className="order-dossier-body">
                            <div className="order-items-sublist">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="order-item-row">
                                  <div className="order-item-thumb">
                                    <img src={it.image} alt={it.name} loading="lazy" />
                                  </div>
                                  <div className="order-item-info">
                                    <h4 className="item-title">{it.name}</h4>
                                    <div className="item-specs">
                                      <span>Size: <strong>{it.size}</strong></span>
                                      <span className="spec-bullet">·</span>
                                      <span>Color: <strong>{it.color}</strong></span>
                                    </div>
                                    <div className="item-cost">{formatPrice(it.price)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="order-tracking-strip">
                              <div className="tracking-meta">
                                <span className="lbl">Waybill Tracking:</span>
                                <span className="val">{order.trackingNumber}</span>
                              </div>
                              <div className="order-total-block">
                                <span className="lbl">Commission Total:</span>
                                <span className="total-val">{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeProfileTab === 'measurements' && (
                /* --- TAB 2: BESPOKE MEASUREMENTS --- */
                <div className="profile-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Bespoke Fit & Anatomical Registry</h2>
                      <p className="panel-desc">Our artisans in Florence reference these proportions during pattern cutting.</p>
                    </div>
                  </div>

                  {measurementSaved && (
                    <div className="auth-alert success-alert" role="status">
                      ✓ Anatomical specifications updated in the master registry.
                    </div>
                  )}

                  <form className="measurements-form" onSubmit={handleSaveMeasurements}>
                    <div className="form-grid-3">
                      <div className="form-group">
                        <label htmlFor="m-chest">Chest Circumference</label>
                        <input
                          id="m-chest"
                          type="text"
                          value={measurements.chest}
                          onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                          placeholder='e.g. 40"'
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="m-shoulders">Shoulder Width (Bi-Acromial)</label>
                        <input
                          id="m-shoulders"
                          type="text"
                          value={measurements.shoulders}
                          onChange={(e) => setMeasurements({ ...measurements, shoulders: e.target.value })}
                          placeholder='e.g. 18.5"'
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="m-sleeves">Sleeve Length (Center Back to Cuff)</label>
                        <input
                          id="m-sleeves"
                          type="text"
                          value={measurements.sleeves}
                          onChange={(e) => setMeasurements({ ...measurements, sleeves: e.target.value })}
                          placeholder='e.g. 34"'
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="m-height">Client Stature / Height</label>
                        <input
                          id="m-height"
                          type="text"
                          value={measurements.height}
                          onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                          placeholder="e.g. 6ft 0in (183 cm)"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="m-cut">Preferred Silhouette Cut</label>
                        <select
                          id="m-cut"
                          value={measurements.fitPreference}
                          onChange={(e) => setMeasurements({ ...measurements, fitPreference: e.target.value })}
                        >
                          <option value="Tailored Slim">Tailored Slim (Tuscan Salon Standard)</option>
                          <option value="Classic Regular">Classic Regular (Comfort Layering)</option>
                          <option value="Relaxed Drop">Relaxed Drop (Contemporary Streetwear)</option>
                          <option value="Oversized Boxy">Oversized Boxy (Winter Heavyweight)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-actions-row">
                      <button type="submit" className="action-pill-btn">
                        Save Anatomical Measurements ✓
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeProfileTab === 'address' && (
                /* --- TAB 3: SHIPPING ADDRESS --- */
                <div className="profile-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Courier Delivery Destination</h2>
                      <p className="panel-desc">Where your insured commissions and physical archive lookbooks will be dispatched.</p>
                    </div>
                  </div>

                  {addressSaved && (
                    <div className="auth-alert success-alert" role="status">
                      ✓ Delivery address updated successfully.
                    </div>
                  )}

                  <form className="address-form" onSubmit={handleSaveAddress}>
                    <div className="form-group">
                      <label htmlFor="addr-street">Street Address & Suite</label>
                      <input
                        id="addr-street"
                        type="text"
                        value={addressData.address}
                        onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-grid-3">
                      <div className="form-group">
                        <label htmlFor="addr-city">City</label>
                        <input
                          id="addr-city"
                          type="text"
                          value={addressData.city}
                          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="addr-state">State / Province</label>
                        <input
                          id="addr-state"
                          type="text"
                          value={addressData.state}
                          onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="addr-postal">Postal Code</label>
                        <input
                          id="addr-postal"
                          type="text"
                          value={addressData.postalCode}
                          onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="addr-country">Country / Territory</label>
                      <input
                        id="addr-country"
                        type="text"
                        value={addressData.country}
                        onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-actions-row">
                      <button type="submit" className="action-pill-btn">
                        Update Delivery Address ✓
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeProfileTab === 'privileges' && (
                /* --- TAB 4: VIP PRIVILEGES --- */
                <div className="profile-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Collector Privileges & Archive Access</h2>
                      <p className="panel-desc">Permanent benefits endowed to members of the Suedo Atelier Guild.</p>
                    </div>
                  </div>

                  <div className="privileges-grid">
                    <div className="privilege-card">
                      <div className="card-badge">ACTIVE VOUCHER</div>
                      <h3 className="card-heading">10% Welcome Courtesy</h3>
                      <p className="card-copy">Enjoy 10% off your next commission across any suede, puffer, or varsity silhouette.</p>
                      <div className="voucher-code-box">
                        <span className="code-text">FLORENCE10</span>
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={() => copyVoucherCode('FLORENCE10')}
                        >
                          {copiedVoucher ? 'Copied ✓' : 'Copy Code'}
                        </button>
                      </div>
                    </div>

                    <div className="privilege-card">
                      <div className="card-badge complimentary">COMPLIMENTARY</div>
                      <h3 className="card-heading">Annual Suede Spa & Nap Reconditioning</h3>
                      <p className="card-copy">Send your jacket to our Florence or Milan atelier once per year for deep steam de-creasing and volcanic pumice nap restoration at zero cost.</p>
                      <span className="perk-validity">Valid across the lifetime of your garment.</span>
                    </div>

                    <div className="privilege-card">
                      <div className="card-badge">CONCIERGE</div>
                      <h3 className="card-heading">Private Salon Appointment Booking</h3>
                      <p className="card-copy">Schedule an in-person private fitting salon in Florence, Paris, Milan, or New York with custom measurement tailoring.</p>
                      <a href="#faq" className="concierge-link" onClick={(e) => { e.preventDefault(); alert('Please contact concierge@suedo.atelier for salon reservations.'); }}>
                        Request Private Salon Fitting →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Suedo Atelier API Service Client
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('suedo_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const errorMsg = data?.detail || `API request failed with status ${res.status}`;
      return { success: false, status: res.status, error: errorMsg };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Network connection failed' };
  }
}

// Auth API Calls
export async function loginApi(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerApi({ name, email, phone, size, password }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, size, password })
  });
}

export async function fetchMeApi() {
  return apiRequest('/api/auth/me');
}

// Products API Calls
export async function fetchProductsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/products${query ? `?${query}` : ''}`);
}

export async function fetchProductByIdApi(id) {
  return apiRequest(`/api/products/${id}`);
}

// Profile API Calls
export async function updateMeasurementsApi(measurements) {
  return apiRequest('/api/users/measurements', {
    method: 'PUT',
    body: JSON.stringify(measurements)
  });
}

export async function updateAddressApi(address) {
  return apiRequest('/api/users/address', {
    method: 'PUT',
    body: JSON.stringify(address)
  });
}

// Orders API Calls
export async function fetchMyOrdersApi() {
  return apiRequest('/api/orders/my-orders');
}

export async function placeOrderApi(orderData) {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

// Currency Rates API Call
export async function fetchExchangeRatesApi() {
  return apiRequest('/api/currency/rates');
}

// Payment Integration API Calls
export async function fetchPaymentConfigApi() {
  return apiRequest('/api/payments/config');
}

export async function createRazorpayOrderApi(payload) {
  return apiRequest('/api/payments/razorpay/create-order', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function verifyRazorpayPaymentApi(payload) {
  return apiRequest('/api/payments/razorpay/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function createStripeIntentApi(payload) {
  return apiRequest('/api/payments/stripe/create-intent', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function verifyStripePaymentApi(payload) {
  return apiRequest('/api/payments/stripe/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

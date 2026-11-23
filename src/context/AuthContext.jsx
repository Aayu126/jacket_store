import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginApi,
  registerApi,
  fetchMeApi,
  updateMeasurementsApi,
  updateAddressApi
} from '../services/api.js';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'SUE-7821',
  name: 'Alexander Vance',
  firstName: 'Alexander',
  lastName: 'Vance',
  email: 'alexander.vance@suedo.atelier',
  phone: '+1 (555) 382-9014',
  memberSince: 'October 2024',
  tier: 'Florence Atelier Guild',
  avatarInitials: 'AV',
  shippingAddress: {
    address: '742 Evergreen Terrace, Suite 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10012',
    country: 'United States'
  },
  measurements: {
    chest: '40"',
    shoulders: '18.5"',
    sleeves: '34"',
    height: "6'0\"",
    fitPreference: 'Tailored Slim'
  },
  orders: [
    {
      id: 'SA-942180',
      date: 'November 18, 2026',
      status: 'Dispatched · DHL Express Insured',
      statusType: 'in_transit',
      trackingNumber: 'DHL-IT-884920194',
      total: 2450,
      items: [
        {
          id: 'trucker-tobacco-brown',
          name: 'Suede Trucker Tobacco Brown',
          size: 'L',
          color: 'Tobacco Brown',
          price: 2450,
          image: 'Images/Brown jacket images/Brown Jacket Front-tight.webp'
        }
      ]
    },
    {
      id: 'SA-810392',
      date: 'September 24, 2026',
      status: 'Delivered · Signature Verified',
      statusType: 'delivered',
      trackingNumber: 'DHL-IT-719301290',
      total: 2550,
      items: [
        {
          id: 'puffer-onyx-black',
          name: 'Puffer Jacket Onyx Black',
          size: 'L',
          color: 'Onyx Black',
          price: 2550,
          image: 'Images/Puffer jacket black/puffer black front view-tight.webp'
        }
      ]
    }
  ]
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('suedo_user');
      return stored ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('suedo_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('suedo_user');
      }
    } catch (_) {}
  }, [user]);

  // Sync session with backend API if JWT token is stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem('suedo_token');
    if (token) {
      fetchMeApi().then(res => {
        if (res.success && res.data) {
          const u = res.data;
          setUser(prev => ({
            ...(prev || DEMO_USER),
            id: `SUE-${u.id}`,
            name: u.full_name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            measurements: u.profile ? {
              chest: u.profile.chest,
              shoulders: u.profile.shoulders,
              sleeves: u.profile.sleeves,
              height: u.profile.height,
              fitPreference: u.profile.fit_preference
            } : (prev?.measurements || DEMO_USER.measurements),
            shippingAddress: u.profile ? {
              address: u.profile.address_line,
              city: u.profile.city,
              state: u.profile.state,
              postalCode: u.profile.postal_code,
              country: u.profile.country
            } : (prev?.shippingAddress || DEMO_USER.shippingAddress)
          }));
        }
      }).catch(() => {});
    }
  }, []);

  const login = async (email, password) => {
    // 1. Attempt connection with live FastAPI + MySQL backend
    try {
      const apiRes = await loginApi(email, password);
      if (apiRes.success && apiRes.data?.access_token) {
        localStorage.setItem('suedo_token', apiRes.data.access_token);
        const meRes = await fetchMeApi();
        if (meRes.success && meRes.data) {
          const u = meRes.data;
          const mappedUser = {
            id: `SUE-${u.id}`,
            name: u.full_name,
            firstName: u.full_name.split(' ')[0] || 'Collector',
            lastName: u.full_name.split(' ').slice(1).join(' ') || '',
            email: u.email,
            phone: u.phone || '+1 (555) 000-0000',
            memberSince: new Date(u.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            tier: u.role === 'admin' ? 'Master Tailor (Admin)' : 'Florence Atelier Member',
            avatarInitials: u.full_name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase(),
            shippingAddress: {
              address: u.profile?.address_line || 'Bespoke Registry on File',
              city: u.profile?.city || 'Florence',
              state: u.profile?.state || 'Tuscany',
              postalCode: u.profile?.postal_code || '50123',
              country: u.profile?.country || 'Italy'
            },
            measurements: {
              chest: u.profile?.chest || '40"',
              shoulders: u.profile?.shoulders || '18.5"',
              sleeves: u.profile?.sleeves || '34"',
              height: u.profile?.height || "6'0\"",
              fitPreference: u.profile?.fit_preference || 'Tailored Slim'
            },
            orders: DEMO_USER.orders
          };
          setUser(mappedUser);
          return { success: true, user: mappedUser };
        }
      } else if (apiRes.error && !apiRes.error.includes('Failed to fetch')) {
        // If server explicitly returned an auth error (e.g. 401 wrong password)
        return { success: false, error: apiRes.error };
      }
    } catch (_) {}

    // 2. Offline fallback for instant collector demo access
    const firstName = email.split('@')[0] || 'Collector';
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const newUser = {
      ...DEMO_USER,
      email: email,
      name: `${formattedName} Vance`,
      firstName: formattedName,
      avatarInitials: formattedName.substring(0, 2).toUpperCase()
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  };

  const loginWithGoogle = () => {
    const googleUser = {
      ...DEMO_USER,
      id: 'SUE-G8912',
      name: 'Alexander Vance',
      firstName: 'Alexander',
      lastName: 'Vance',
      email: 'alexander.vance@gmail.com',
      avatarInitials: 'AV',
      tier: 'Florence Atelier Guild (Google Verified)',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    setUser(googleUser);
    return { success: true, user: googleUser };
  };

  const loginWithApple = () => {
    const appleUser = {
      ...DEMO_USER,
      id: 'SUE-A4091',
      name: 'Alexander Vance',
      firstName: 'Alexander',
      lastName: 'Vance',
      email: 'alexander.vance@privaterelay.appleid.com',
      avatarInitials: 'AV',
      tier: 'Florence Atelier Guild (Apple Verified)',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    setUser(appleUser);
    return { success: true, user: appleUser };
  };

  const signup = async ({ name, email, phone, size, password }) => {
    // 1. Attempt registering with live FastAPI backend
    try {
      const regRes = await registerApi({ name, email, phone, size, password });
      if (regRes.success) {
        // Auto-login to obtain JWT token
        return await login(email, password);
      } else if (regRes.error && !regRes.error.includes('Failed to fetch')) {
        return { success: false, error: regRes.error };
      }
    } catch (_) {}

    // 2. Offline fallback if API is not yet running
    const parts = name.trim().split(' ');
    const firstName = parts[0] || 'Collector';
    const lastName = parts.slice(1).join(' ') || '';
    const initials = (firstName[0] + (lastName[0] || firstName[1] || 'S')).toUpperCase();
    const newId = `SUE-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      id: newId,
      name: name.trim(),
      firstName,
      lastName,
      email: email.trim(),
      phone: phone.trim() || '+1 (555) 000-0000',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      tier: 'Florence Atelier Member',
      avatarInitials: initials,
      shippingAddress: {
        address: 'Bespoke Registry on File',
        city: 'Florence / International',
        state: 'Tuscany',
        postalCode: '50123',
        country: 'Italy'
      },
      measurements: {
        chest: size === 'S' ? '38"' : size === 'M' ? '40"' : size === 'L' ? '42"' : size === 'XL' ? '44"' : '46"',
        shoulders: '18"',
        sleeves: '34"',
        height: "5'11\"",
        fitPreference: 'Tailored Atelier Fit'
      },
      orders: []
    };

    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('suedo_token');
    localStorage.removeItem('suedo_user');
    setUser(null);
  };

  const updateProfile = (partialData) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...partialData
      };
    });
  };

  const updateMeasurements = (measurements) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        measurements: {
          ...prev.measurements,
          ...measurements
        }
      };
    });
    // Sync with backend API if authenticated
    updateMeasurementsApi(measurements).catch(() => {});
  };

  const updateAddress = (shippingAddress) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          ...shippingAddress
        }
      };
    });
    // Sync with backend API if authenticated
    updateAddressApi({
      address_line: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postal_code: shippingAddress.postalCode,
      country: shippingAddress.country
    }).catch(() => {});
  };

  const addOrder = (orderData) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        orders: [orderData, ...(prev.orders || [])]
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        loginAsDemo,
        loginWithGoogle,
        loginWithApple,
        signup,
        logout,
        updateProfile,
        updateMeasurements,
        updateAddress,
        addOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

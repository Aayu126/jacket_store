import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (email, password) => {
    // If logging in with demo credentials or any email, authenticate
    const firstName = email.split('@')[0] || 'Collector';
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    
    // Check if there's an existing registered profile
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      return { success: true, user };
    }

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

  const signup = ({ name, email, phone, size, password }) => {
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

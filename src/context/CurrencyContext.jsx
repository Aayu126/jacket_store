import React, { createContext, useContext, useState, useEffect } from 'react';

export const CURRENCIES = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    label: 'INR (₹) — India',
    rate: 1.0,
    decimals: 0
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'United States Dollar',
    flag: '🇺🇸',
    label: 'USD ($) — United States',
    rate: 0.0116,
    decimals: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'European Euro',
    flag: '🇪🇺',
    label: 'EUR (€) — European Union',
    rate: 0.0109,
    decimals: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    label: 'GBP (£) — United Kingdom',
    rate: 0.0091,
    decimals: 2
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    label: 'CAD ($) — Canada',
    rate: 0.0164,
    decimals: 2
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    label: 'AUD ($) — Australia',
    rate: 0.0182,
    decimals: 2
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    label: 'JPY (¥) — Japan',
    rate: 1.76,
    decimals: 0
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF ',
    name: 'Swiss Franc',
    flag: '🇨🇭',
    label: 'CHF (Fr) — Switzerland',
    rate: 0.0103,
    decimals: 2
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    label: 'AED (د.إ) — United Arab Emirates',
    rate: 0.0426,
    decimals: 2
  },
  SGD: {
    code: 'SGD',
    symbol: 'SG$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    label: 'SGD ($) — Singapore',
    rate: 0.0155,
    decimals: 2
  }
};

export function formatCurrency(amountInBase, currencyCode = 'INR') {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const num = typeof amountInBase === 'number' ? amountInBase : parseFloat(amountInBase) || 0;
  const converted = num * curr.rate;

  if (curr.decimals === 0) {
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${curr.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: curr.decimals,
    maximumFractionDigits: curr.decimals
  })}`;
}

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('suedo_currency') || 'INR';
    } catch (_) {
      return 'INR';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('suedo_currency', currency);
    } catch (_) {}
  }, [currency]);

  const changeCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrency(code);
    }
  };

  const formatPrice = (baseAmount) => {
    return formatCurrency(baseAmount, currency);
  };

  const currentCurrency = CURRENCIES[currency] || CURRENCIES.INR;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currentCurrency,
        changeCurrency,
        formatPrice,
        currencies: CURRENCIES
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}

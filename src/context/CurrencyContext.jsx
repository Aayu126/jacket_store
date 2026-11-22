import React, { createContext, useContext, useState, useEffect } from 'react';

export const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'United States Dollar',
    flag: '🇺🇸',
    label: 'USD ($) — United States',
    rate: 1.0,
    decimals: 0
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'European Euro',
    flag: '🇪🇺',
    label: 'EUR (€) — European Union',
    rate: 1.0,
    decimals: 0
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    label: 'GBP (£) — United Kingdom',
    rate: 1.0,
    decimals: 0
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    label: 'CAD ($) — Canada',
    rate: 1.0,
    decimals: 0
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    label: 'AUD ($) — Australia',
    rate: 1.0,
    decimals: 0
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    label: 'JPY (¥) — Japan',
    rate: 1.0,
    decimals: 0
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF ',
    name: 'Swiss Franc',
    flag: '🇨🇭',
    label: 'CHF (Fr) — Switzerland',
    rate: 1.0,
    decimals: 0
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    label: 'INR (₹) — India',
    rate: 1.0,
    decimals: 0
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    label: 'AED (د.إ) — United Arab Emirates',
    rate: 1.0,
    decimals: 0
  },
  SGD: {
    code: 'SGD',
    symbol: 'SG$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    label: 'SGD ($) — Singapore',
    rate: 1.0,
    decimals: 0
  }
};

export function formatCurrency(amountInUsd, currencyCode = 'USD') {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const num = typeof amountInUsd === 'number' ? amountInUsd : parseFloat(amountInUsd) || 0;
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
      return localStorage.getItem('suedo_currency') || 'USD';
    } catch (_) {
      return 'USD';
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

  const formatPrice = (usdAmount) => {
    return formatCurrency(usdAmount, currency);
  };

  const currentCurrency = CURRENCIES[currency] || CURRENCIES.USD;

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

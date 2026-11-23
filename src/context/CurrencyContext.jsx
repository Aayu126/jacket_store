import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchExchangeRatesApi } from '../services/api.js';

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

export function formatCurrency(amountInBase, currencyCode = 'INR', dynamicRate = null) {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const num = typeof amountInBase === 'number' ? amountInBase : parseFloat(amountInBase) || 0;
  const rateToUse = dynamicRate !== null ? dynamicRate : curr.rate;
  const converted = num * rateToUse;

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

  // Rates map initialized with defaults
  const [rates, setRates] = useState(() => {
    try {
      const cached = localStorage.getItem('suedo_live_rates');
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    const initial = {};
    Object.keys(CURRENCIES).forEach((code) => {
      initial[code] = CURRENCIES[code].rate;
    });
    return initial;
  });

  const [ratesStatus, setRatesStatus] = useState('initializing'); // 'live' | 'cached' | 'fallback'

  // Fetch live exchange rates on mount
  useEffect(() => {
    let isMounted = true;

    async function loadRates() {
      try {
        // Try backend currency API first
        const res = await fetchExchangeRatesApi();
        if (res.success && res.data?.rates) {
          if (!isMounted) return;
          setRates(res.data.rates);
          setRatesStatus(res.data.cached ? 'cached' : 'live');
          localStorage.setItem('suedo_live_rates', JSON.stringify(res.data.rates));
          return;
        }

        // Direct fallback to free open API
        const fallbackRes = await fetch('https://open.er-api.com/v6/latest/INR').then(r => r.json());
        if (fallbackRes?.rates && isMounted) {
          const merged = {};
          Object.keys(CURRENCIES).forEach(code => {
            merged[code] = fallbackRes.rates[code] || CURRENCIES[code].rate;
          });
          setRates(merged);
          setRatesStatus('live');
          localStorage.setItem('suedo_live_rates', JSON.stringify(merged));
        }
      } catch (err) {
        console.warn('Currency live rates unavailable, using atelier baseline:', err);
        if (isMounted) setRatesStatus('fallback');
      }
    }

    loadRates();
    return () => { isMounted = false; };
  }, []);

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

  const currentRate = rates[currency] || CURRENCIES[currency]?.rate || 1.0;

  const formatPrice = (baseAmount) => {
    return formatCurrency(baseAmount, currency, currentRate);
  };

  const currentCurrency = {
    ...(CURRENCIES[currency] || CURRENCIES.INR),
    rate: currentRate
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currentCurrency,
        changeCurrency,
        formatPrice,
        currencies: CURRENCIES,
        rates,
        ratesStatus
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

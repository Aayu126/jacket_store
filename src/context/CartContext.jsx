import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('suedo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('suedo_cart', JSON.stringify(cartItems));
    } catch (_) {}
  }, [cartItems]);

  const addToCart = (product, size = 'M', quantity = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.name === product.name && item.size === size);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, size, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productName, size) => {
    setCartItems(prev => prev.filter(item => !(item.product.name === productName && item.size === size)));
  };

  const updateQuantity = (productName, size, qty) => {
    if (qty <= 0) {
      removeFromCart(productName, size);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.product.name === productName && item.size === size) {
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((acc, item) => {
    const priceNum = item.product.numericPrice || parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
    return acc + priceNum * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // In a real app with auth, this would fetch from /api/cart on mount if token exists.
  // For immediate UI feedback in this demo, we use local state initialized with a mock structure matching the backend.
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Farm Fresh Tomatoes', price: 40, qty: 1, image: 'bg-red-100', gst: 0 },
    { id: 2, name: 'Aashirvaad Whole Wheat Atta', price: 210, qty: 1, image: 'bg-yellow-100', gst: 0 },
    { id: 6, name: 'Fortune Sunflower Oil', price: 135, qty: 2, image: 'bg-orange-100', gst: 5 },
  ]);
  
  const [coupon, setCoupon] = useState(null); // e.g., { code: 'WELCOME10', discount: 20 }

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalTax = cartItems.reduce((acc, item) => acc + (item.price * item.qty * (item.gst || 0)) / 100, 0);
  const deliveryCharges = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const discountAmount = coupon ? coupon.discount : 0;
  
  const estimatedTotal = subtotal + totalTax + deliveryCharges - discountAmount;

  // Actions (these would call the backend APIs like POST /api/cart/add)
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + quantity } : item);
      }
      return [...prev, { ...product, qty: quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty: quantity } : item));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = (code) => {
    if (code === 'SAVE100' && subtotal > 500) {
      setCoupon({ code, discount: 100 });
      return { success: true, message: 'Coupon applied successfully!' };
    } else {
      setCoupon(null);
      return { success: false, message: 'Invalid or expired coupon.' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      coupon,
      totals: { subtotal, totalTax, deliveryCharges, discountAmount, estimatedTotal },
      addToCart,
      updateQuantity,
      removeFromCart,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

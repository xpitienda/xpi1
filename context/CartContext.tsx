'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
}

type CartContextType = {
  cart: CartItem[];
  customerInfo: CustomerInfo;
  saveCustomerData: boolean;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  total: number;
  subtotal: number;
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  toggleSaveData: () => void;
  clearCustomerInfo: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializar SIEMPRE vacío para evitar mismatch de hidratación
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', phone: '', address: '', city: '' });
  const [saveCustomerData, setSaveCustomerData] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Cargar desde localStorage SOLO en el cliente, después del montaje
  useEffect(() => {
    setIsMounted(true);
    
    const savedCart = localStorage.getItem('xpitienda-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedCustomer = localStorage.getItem('xpitienda-customer-info');
    if (savedCustomer) {
      setCustomerInfo(JSON.parse(savedCustomer));
      setSaveCustomerData(true);
    }
  }, []);

  // Guardar en localStorage cuando el carrito cambie (solo si ya montó)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('xpitienda-cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (isMounted) {
      if (saveCustomerData) {
        localStorage.setItem('xpitienda-customer-info', JSON.stringify(customerInfo));
        localStorage.setItem('xpitienda-save-data', 'true');
      } else {
        localStorage.removeItem('xpitienda-customer-info');
        localStorage.setItem('xpitienda-save-data', 'false');
      }
    }
  }, [customerInfo, saveCustomerData, isMounted]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const isInCart = (productId: string) => cart.some(item => item.id === productId);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...info }));
  };

  const toggleSaveData = () => {
    setSaveCustomerData(prev => !prev);
  };

  const clearCustomerInfo = () => {
    setCustomerInfo({ name: '', phone: '', address: '', city: '' });
    setSaveCustomerData(false);
    localStorage.removeItem('xpitienda-customer-info');
    localStorage.setItem('xpitienda-save-data', 'false');
  };

  return (
    <CartContext.Provider value={{
      cart,
      customerInfo,
      saveCustomerData,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      total,
      subtotal,
      updateCustomerInfo,
      toggleSaveData,
      clearCustomerInfo,
      isCartOpen,
      setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
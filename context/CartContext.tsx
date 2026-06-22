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
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  toggleSaveData: () => void;
  clearCustomerInfo: () => void;
  subtotal: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    city: ''
  });
  const [saveCustomerData, setSaveCustomerData] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('xpitienda-cart');
    const savedInfo = localStorage.getItem('xpitienda-customer-info');
    const savedPreference = localStorage.getItem('xpitienda-save-data');
    
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      } catch (error) { console.error('Error cargando carrito:', error); }
    }
    
    if (savedPreference === 'true') {
      setSaveCustomerData(true);
      if (savedInfo) {
        try {
          const parsed = JSON.parse(savedInfo);
          setCustomerInfo(parsed);
        } catch (error) { console.error('Error cargando info del cliente:', error); }
      }
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('xpitienda-cart', JSON.stringify(cart));
      
      if (saveCustomerData) {
        localStorage.setItem('xpitienda-customer-info', JSON.stringify(customerInfo));
        localStorage.setItem('xpitienda-save-data', 'true');
      } else {
        localStorage.removeItem('xpitienda-customer-info');
        localStorage.setItem('xpitienda-save-data', 'false');
      }
    }
  }, [cart, customerInfo, saveCustomerData, mounted]);

  const addToCart = (product: any) => {
    const availableStock = product.stock;
    if (availableStock !== undefined && availableStock <= 0) return;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (availableStock !== undefined && existingItem.quantity >= availableStock) return prevCart;
        return prevCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1, stock: availableStock } : item);
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, stock: availableStock }];
    });
  };

  const removeFromCart = (productId: string) => setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prevCart) => prevCart.map((item) => {
      if (item.id === productId) {
        const maxQty = item.stock !== undefined ? item.stock : quantity;
        return { ...item, quantity: Math.min(quantity, maxQty) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);
  const isInCart = (productId: string) => cart.some((item) => item.id === productId);

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...info }));
  };

  const toggleSaveData = () => {
    setSaveCustomerData((prev) => {
      if (!prev) {
        // Si activa guardar, guardar los datos actuales
        localStorage.setItem('xpitienda-customer-info', JSON.stringify(customerInfo));
      } else {
        // Si desactiva, borrar los datos guardados
        localStorage.removeItem('xpitienda-customer-info');
      }
      return !prev;
    });
  };

  const clearCustomerInfo = () => {
    setCustomerInfo({ name: '', phone: '', address: '', city: '' });
    setSaveCustomerData(false);
    localStorage.removeItem('xpitienda-customer-info');
    localStorage.setItem('xpitienda-save-data', 'false');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <CartContext.Provider value={{ cart, customerInfo, saveCustomerData, addToCart, removeFromCart, updateQuantity, clearCart, isInCart, updateCustomerInfo, toggleSaveData, clearCustomerInfo, subtotal, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}
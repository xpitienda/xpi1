'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
  stock?: number;
};

type ProductModalContextType = {
  selectedProduct: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
};

const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

export function ProductModalProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <ProductModalContext.Provider value={{ selectedProduct, openModal, closeModal }}>
      {children}
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const context = useContext(ProductModalContext);
  if (context === undefined) {
    throw new Error('useProductModal must be used within a ProductModalProvider');
  }
  return context;
}
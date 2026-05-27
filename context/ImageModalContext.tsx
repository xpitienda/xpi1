'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
};

type ImageModalContextType = {
  openModal: (product: Product) => void;
  closeModal: () => void;
};

const ImageModalContext = createContext<ImageModalContextType | null>(null);

export function useImageModal() {
  const context = useContext(ImageModalContext);
  if (!context) {
    throw new Error('useImageModal must be used within ImageModalProvider');
  }
  return context;
}

export function ImageModalProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const openModal = (p: Product) => setProduct(p);
  const closeModal = () => setProduct(null);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      quantity: 1,
    });
    showToast(`${product.name} agregado al carrito`, 'success');
  };

  const getCategoryColor = (cat?: string) => {
    if (cat === 'Ropa') return 'bg-xpi-purple';
    if (cat === 'Tecnologia') return 'bg-blue-500';
    if (cat === 'Deportes') return 'bg-xpi-green';
    if (cat === 'Hogar') return 'bg-orange-500';
    if (cat === 'Accesorios') return 'bg-pink-500';
    return 'bg-gray-500';
  };

  return (
    <ImageModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      
      {/* Image Modal/Lightbox */}
      {product && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-3xl w-full animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Image Container */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full max-h-[70vh] object-contain"
              />
              
              {/* Product Info in Modal */}
              <div className="p-4 bg-gradient-to-r from-xpi-green/10 to-xpi-purple/10">
                <h3 className="font-bold text-xl text-gray-800 mb-1">{product.name}</h3>
                {product.category && (
                  <span className={`inline-block ${getCategoryColor(product.category)} text-white px-3 py-1 rounded-lg text-sm font-medium mb-2`}>
                    {product.category}
                  </span>
                )}
                {product.description && (
                  <p className="text-gray-600 mb-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-xpi-green-vibrant">
                    ${Number(product.price).toLocaleString('es-CO')}
                  </span>
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3 rounded-xl bg-xpi-purple text-white font-semibold flex items-center gap-2 hover:bg-xpi-purple-dark transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ImageModalContext.Provider>
  );
}

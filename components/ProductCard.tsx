'use client';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ShoppingCart } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
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
    if (cat === 'Ropa') return 'bg-xpi-blue';
    if (cat === 'Tecnologia') return 'bg-xpi-cyan';
    if (cat === 'Deportes') return 'bg-xpi-orange';
    if (cat === 'Hogar') return 'bg-purple-500';
    if (cat === 'Accesorios') return 'bg-pink-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-[#1a0a2e]/80 rounded-xl overflow-hidden border border-[#6b3fa0]/30 hover:border-xpi-green/50 transition-all group">
      {/* Image */}
      <div className="relative h-28 sm:h-32 overflow-hidden bg-[#2d1b4e]/50">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.category && (
          <span className={`absolute top-1.5 left-1.5 ${getCategoryColor(product.category)} text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase`}>
            {product.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">
        <h3 className="font-semibold text-white text-sm mb-0.5 truncate">{product.name}</h3>
        <p className="text-gray-400 text-xs mb-2 line-clamp-1">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base font-bold text-xpi-green">
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-xpi-green flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

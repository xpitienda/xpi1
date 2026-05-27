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
    // Solo colores morado y verde como el logo
    if (cat === 'Ropa') return 'bg-[#5a3d7a]';
    if (cat === 'Tecnologia') return 'bg-xpi-green';
    if (cat === 'Deportes') return 'bg-[#4a2d6a]';
    if (cat === 'Hogar') return 'bg-xpi-green/80';
    if (cat === 'Accesorios') return 'bg-[#6b3fa0]';
    return 'bg-[#5a3d7a]';
  };

  return (
    <div className="bg-[#1a0a2e]/80 rounded-lg overflow-hidden border border-[#6b3fa0]/30 hover:border-xpi-green/50 transition-all group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#2d1b4e]/50">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.category && (
          <span className={`absolute top-1 left-1 ${getCategoryColor(product.category)} text-white px-1 py-0.5 rounded text-[8px] font-semibold uppercase`}>
            {product.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-1.5">
        <h3 className="font-semibold text-white text-xs mb-0.5 truncate">{product.name}</h3>
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-xpi-green">
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-6 h-6 rounded-full bg-xpi-green flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

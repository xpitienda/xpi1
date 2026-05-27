'use client';

import Image from 'next/image';
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
    if (cat === 'Hogar') return 'bg-xpi-orange';
    if (cat === 'Deportes') return 'bg-xpi-green';
    return 'bg-gray-500';
  };

  return (
    <div 
      className="bg-[#1a0a2e]/80 backdrop-blur-sm rounded-xl border border-[#6b3fa0]/30 overflow-hidden transition-all hover:border-xpi-green/50 hover:shadow-lg hover:shadow-xpi-green/10 group"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[#2d1b4e]">
        <Image 
          src={product.image_url || '/images/placeholder.jpg'} 
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.category && (
          <span className={`absolute top-3 left-3 ${getCategoryColor(product.category)} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}>
            {product.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-white mb-1 truncate">{product.name}</h3>
        
        {product.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-[#6b3fa0]/20">
          <span className="text-xl font-bold text-xpi-green">
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-xpi-green/20 text-xpi-green flex items-center justify-center hover:bg-xpi-green hover:text-white transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

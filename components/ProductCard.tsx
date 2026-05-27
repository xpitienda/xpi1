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
    if (cat === 'Ropa') return 'bg-xpi-purple';
    if (cat === 'Tecnologia') return 'bg-blue-500';
    if (cat === 'Deportes') return 'bg-xpi-green';
    if (cat === 'Hogar') return 'bg-orange-500';
    if (cat === 'Accesorios') return 'bg-pink-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-xpi-purple/30 transition-all group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.category && (
          <span className={`absolute top-2 left-2 ${getCategoryColor(product.category)} text-white px-2 py-1 rounded-lg text-xs font-semibold`}>
            {product.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-xs mb-2 line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-xpi-green">
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-xl bg-xpi-purple text-white flex items-center justify-center hover:bg-xpi-purple-dark transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

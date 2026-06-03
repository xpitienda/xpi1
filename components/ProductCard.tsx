'use client';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useImageModal } from '@/context/ImageModalContext';
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
  const { openModal } = useImageModal();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    if (cat === 'Ropa') return 'bg-[#7B2D5B]';
    if (cat === 'Tecnologia') return 'bg-[#1976D2]';
    if (cat === 'Deportes') return 'bg-[#2E7D32]';
    if (cat === 'Hogar') return 'bg-[#E07A5F]';
    if (cat === 'Accesorios') return 'bg-[#C2185B]';
    return 'bg-[#8D6E63]';
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#2E7D32]/30 shadow-md hover:shadow-lg hover:border-[#2E7D32]/60 transition-all group">
      {/* Image - Click to open modal */}
      <div 
        className="relative aspect-square overflow-hidden bg-[#FDF6E3] cursor-pointer"
        onClick={() => openModal(product)}
      >
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
      <div className="p-3 bg-gradient-to-b from-white to-[#FDF6E3]">
        <h3 className="font-semibold text-[#3D2914] text-sm mb-1 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-[#8D6E63] text-xs mb-2 line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#2E7D32]">
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-xl bg-[#E07A5F] text-white flex items-center justify-center hover:bg-[#C96A52] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

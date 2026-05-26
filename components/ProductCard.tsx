'use client';

import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ShoppingCart, Plus } from 'lucide-react';

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

  const getCategoryStyle = (cat?: string) => {
    const styles: Record<string, string> = {
      'Ropa': 'bg-xpi-purple text-white',
      'Tecnología': 'bg-xpi-green text-white',
      'Hogar': 'bg-xpi-purple-light text-white',
      'Deportes': 'bg-xpi-green-light text-white',
      'General': 'bg-gray-500 text-white',
    };
    return styles[cat || 'General'] || styles['General'];
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:border-xpi-purple/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        {product.category && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md ${getCategoryStyle(product.category)}`}>
            {product.category}
          </span>
        )}
        
        {/* Quick Add Button - appears on hover */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 bg-xpi-purple text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-xpi-purple-dark hover:scale-110 shadow-lg"
          aria-label="Agregar al carrito"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-xpi-purple transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
        )}
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <span className="text-lg font-bold text-xpi-green">
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-xpi-purple/10 text-xpi-purple px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-xpi-purple hover:text-white transition-all duration-200"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { X } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category?: string;
  stock?: number;
};

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#3D2914]">{product.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-[#5D4037]" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-[#FDF6E3]">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23e5e7eb" width="400" height="400"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="80">📦</text></svg>';
              }}
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            {product.category && (
              <span className="inline-block bg-[#2E7D32] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.category}
              </span>
            )}

            <p className="text-3xl font-bold text-[#2E7D32]">
              ${Number(product.price).toLocaleString('es-CO')}
            </p>

            {product.description && (
              <div>
                <h3 className="font-semibold text-[#5D4037] mb-2">Descripción:</h3>
                <p className="text-[#8D6E63]">{product.description}</p>
              </div>
            )}

            {product.stock !== undefined && product.stock !== null && (
              <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                 Stock: {product.stock} {product.stock === 0 ? '(Agotado)' : ''}
              </p>
            )}

            <button
              className="w-full bg-[#E07A5F] text-white py-3 rounded-xl font-semibold hover:bg-[#C96A52] transition-colors"
              onClick={() => {
                // Aquí puedes agregar al carrito
                onClose();
              }}
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ShoppingCart, Plus } from "lucide-react";

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
    showToast(`${product.name} agregado al carrito`, "success");
  };

  const getCategoryStyle = (cat?: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      "Ropa": { bg: "#3b82f6", color: "#ffffff" },
      "Tecnologia": { bg: "#00d4aa", color: "#ffffff" },
      "Hogar": { bg: "#f97316", color: "#ffffff" },
      "Deportes": { bg: "#06b6d4", color: "#ffffff" },
      "General": { bg: "#6b3fa0", color: "#ffffff" },
    };
    return styles[cat || "General"] || styles["General"];
  };

  const categoryStyle = getCategoryStyle(product.category);

  return (
    <div 
      className="group backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
      style={{ 
        background: "rgba(26, 10, 46, 0.8)",
        border: "1px solid rgba(107, 63, 160, 0.3)"
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "rgba(45, 27, 78, 0.3)" }}>
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        {product.category && (
          <span 
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md"
            style={{ background: categoryStyle.bg, color: categoryStyle.color }}
          >
            {product.category}
          </span>
        )}
        
        {/* Quick Add Button - appears on hover */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
          style={{ background: "#f97316" }}
          aria-label="Agregar al carrito"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2 transition-colors" style={{ color: "white" }}>
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-400 text-xs mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
        )}
        
        {/* Price and Action */}
        <div 
          className="flex items-center justify-between pt-3 mt-auto"
          style={{ borderTop: "1px solid rgba(107, 63, 160, 0.3)" }}
        >
          <span className="text-lg font-bold" style={{ color: "#00d4aa" }}>
            ${Number(product.price).toLocaleString("es-CO")}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
            style={{ 
              background: "rgba(0, 212, 170, 0.2)",
              color: "#00d4aa"
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

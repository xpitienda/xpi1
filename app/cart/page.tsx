"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, MessageCircle } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    const message = `Hola! Quiero finalizar mi compra:\n\n${cart
      .map((item) => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toLocaleString("es-CO")}`)
      .join("\n")}\n\n*Total: $${total.toLocaleString("es-CO")}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/573234475311?text=${encodedMessage}`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #2d1b4e 0%, #1a0a2e 50%, #2d1b4e 100%)" }}>
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #2d1b4e 0%, #1a0a2e 50%, #2d1b4e 100%)" }}>
        <Header />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-73px)]">
          <div className="text-center max-w-md">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ 
                background: "rgba(45, 27, 78, 0.5)",
                border: "1px solid rgba(107, 63, 160, 0.5)"
              }}
            >
              <ShoppingCart className="w-12 h-12" style={{ color: "#00d4aa" }} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Tu carrito esta vacio
            </h1>
            <p className="text-gray-400 mb-8">
              Explora nuestro catalogo y encuentra productos increibles
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-full font-semibold transition-all hover:opacity-90"
              style={{ background: "#f97316" }}
            >
              <ArrowLeft className="w-5 h-5" />
              Ver Catalogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #2d1b4e 0%, #1a0a2e 50%, #2d1b4e 100%)" }}>
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link 
                href="/catalog" 
                className="inline-flex items-center gap-2 text-gray-400 mb-2 transition-colors text-sm hover:opacity-80"
                style={{ color: "#00d4aa" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Seguir comprando
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" style={{ color: "#00d4aa" }} />
                <span className="text-white">Carrito de </span>
                <span style={{ color: "#00d4aa" }}>Compras</span>
              </h1>
            </div>
            <span className="text-gray-400">
              {cart.length} {cart.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Products List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 transition-all"
                  style={{ 
                    background: "rgba(26, 10, 46, 0.8)",
                    border: "1px solid rgba(107, 63, 160, 0.3)"
                  }}
                >
                  {/* Product Image - 48x48px */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    style={{ border: "1px solid rgba(107, 63, 160, 0.3)" }}
                  />
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="font-bold" style={{ color: "#00d4aa" }}>
                      ${item.price.toLocaleString("es-CO")}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                      style={{ background: "#3b82f6" }}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    
                    <span className="w-8 text-center font-semibold text-white">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                      style={{ background: "#f97316" }}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-white">
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div 
                className="backdrop-blur-sm rounded-xl p-6 sticky top-24"
                style={{ 
                  background: "rgba(26, 10, 46, 0.8)",
                  border: "1px solid rgba(107, 63, 160, 0.3)"
                }}
              >
                <h2 className="text-lg font-bold text-white mb-4">
                  Resumen del Pedido
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">${total.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envio</span>
                    <span className="font-medium" style={{ color: "#00d4aa" }}>Gratis</span>
                  </div>
                  <div className="pt-3" style={{ borderTop: "1px solid rgba(107, 63, 160, 0.3)" }}>
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-xl font-bold" style={{ color: "#00d4aa" }}>
                        ${total.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full text-white py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ 
                    background: "linear-gradient(90deg, #00d4aa 0%, #00a896 100%)",
                    boxShadow: "0 4px 15px rgba(0, 212, 170, 0.3)"
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar por WhatsApp
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full mt-3 text-gray-400 py-3 rounded-xl font-medium transition-colors text-sm hover:bg-white/5"
                >
                  Vaciar carrito
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Al finalizar seras redirigido a WhatsApp para completar tu pedido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

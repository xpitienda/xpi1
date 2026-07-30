'use client';

import { useCart } from '@/context/CartContext';
import CartSidebar from '@/components/CartSidebar';

export default function GlobalCartSidebar() {
  // Usamos try-catch para manejar el caso donde el contexto no esté disponible
  try {
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();

    return (
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity} 
        onRemoveItem={removeFromCart} 
      />
    );
  } catch (error) {
    // Si no hay CartProvider disponible, no renderizamos nada
    return null;
  }
}

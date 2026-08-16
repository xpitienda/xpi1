'use client';

import { useCart } from '@/context/CartContext';
import CartSidebar from '@/components/CartSidebar';

export default function CartSidebarWrapper() {
  const { cart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  
  return (
    <CartSidebar
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      items={cart}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeFromCart}
    />
  );
}
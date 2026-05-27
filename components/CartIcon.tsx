'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function CartIcon() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart" className="relative p-2 hover:opacity-80 transition-opacity">
      <ShoppingCart className="w-6 h-6 text-white" />
      {mounted && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-xpi-green text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}

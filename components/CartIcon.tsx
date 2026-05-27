// components/CartIcon.tsx
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
    <Link href="/cart" className="relative group p-2">
      <div className="w-10 h-10 rounded-full bg-[#2d1b4e] border border-[#6b3fa0]/30 flex items-center justify-center text-white group-hover:bg-xpi-green/20 group-hover:border-xpi-green/50 transition-all">
        <ShoppingCart className="w-5 h-5" />
      </div>
      {mounted && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-xpi-orange text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
          {count}
        </span>
      )}
    </Link>
  );
}

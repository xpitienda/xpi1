"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) {
    return (
      <Link href="/cart" className="relative group p-2">
        <ShoppingCart className="w-6 h-6 text-white transition-colors" />
      </Link>
    );
  }

  return (
    <Link href="/cart" className="relative group p-2">
      <ShoppingCart className="w-6 h-6 text-white transition-colors" style={{ color: "white" }} />
      {count > 0 && (
        <span 
          className="absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm"
          style={{ 
            background: "#f97316",
            border: "2px solid #1a0a2e"
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CartIcon from "./CartIcon";
import { ChevronLeft } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <header 
      className="shadow-lg sticky top-0 z-50"
      style={{ 
        background: "linear-gradient(90deg, #2d1b4e, #1a0a2e, #2d1b4e)",
        borderBottom: "1px solid rgba(107, 63, 160, 0.3)"
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "#3b82f6" }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo-xpitienda.png" 
              alt="XPI Tienda"
              width={140}
              height={56}
              className="object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link 
              href="/catalog" 
              className="font-medium transition-colors hidden md:block hover:opacity-80"
              style={{ color: "#00d4aa" }}
            >
              Catalogo
            </Link>
            
            <Link 
              href="/vender" 
              className="text-white px-4 py-2 rounded-full font-medium transition-all hover:opacity-90 text-sm md:text-base"
              style={{ background: "#f97316" }}
            >
              + Vender
            </Link>
            
            <CartIcon />
          </nav>
        </div>
      </div>
    </header>
  );
}

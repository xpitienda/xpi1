'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CartIcon from './CartIcon';

export default function Header() {
  const router = useRouter();
  
  return (
    <header className="bg-[#1a0a2e]/95 backdrop-blur-sm sticky top-0 z-50 border-b border-xpi-green/20 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-xpi-green text-white flex items-center justify-center hover:bg-xpi-green-dark transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo-xpitienda.png" 
              alt="XPI Tienda"
              width={100}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            <Link 
              href="/catalog" 
              className="text-xpi-green hover:text-xpi-green-dark font-medium transition-colors hidden md:block"
            >
              Catalogo
            </Link>
            
            <Link 
              href="/vender" 
              className="bg-xpi-green text-white px-4 py-2 rounded-xl font-medium hover:bg-xpi-green-dark transition-colors text-sm"
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

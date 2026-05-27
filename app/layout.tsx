// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'XPI Tienda - Tu Marketplace',
  description: 'Compra y vende productos de forma segura',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans bg-[#1a0a2e]`}>
        <CartProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}

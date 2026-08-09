import './globals.css';
import GlobalCartSidebar from '@/components/GlobalCartSidebar';
import ViewModeToggleWrapper from '@/components/view-mode-toggle-wrapper';
import { ViewModeProvider } from '@/lib/view-mode-context';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import { ImageModalProvider } from '@/context/ImageModalContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

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
      <body className={`${inter.variable} font-sans`}>
        <ViewModeProvider>
          <CartProvider>
            <AdminAuthProvider>
              <ToastProvider>
                <ImageModalProvider>
                  {children}
                </ImageModalProvider>
              </ToastProvider>
            </AdminAuthProvider>
            {/* ✅ ESTO ES LO QUE FALTABA: Renderiza la barra lateral del carrito en toda la app */}
            <GlobalCartSidebar />
          </CartProvider>
          {/* ✅ Botón flotante para cambiar modo de vista (solo en usuario/vendedor) */}
          <ViewModeToggleWrapper />
        </ViewModeProvider>
      </body>
    </html>
  );
}
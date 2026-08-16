import { ViewModeProvider } from '@/lib/view-mode-context';
import ViewModeToggleWrapper from '@/components/view-mode-toggle-wrapper';
import { CartProvider } from '@/context/CartContext';
import CartSidebarWrapper from '@/components/CartSidebarWrapper';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ViewModeProvider>
        {children}
        <ViewModeToggleWrapper />
        <CartSidebarWrapper />
      </ViewModeProvider>
    </CartProvider>
  );
}
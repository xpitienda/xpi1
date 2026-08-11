import { ViewModeProvider } from '@/lib/view-mode-context';
import ViewModeToggleWrapper from '@/components/view-mode-toggle-wrapper';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewModeProvider>
      {children}
      <ViewModeToggleWrapper />
    </ViewModeProvider>
  );
}
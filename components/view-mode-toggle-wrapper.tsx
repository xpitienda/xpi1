'use client';

import { usePathname } from 'next/navigation';
import ViewModeToggle from './view-mode-toggle';

export default function ViewModeToggleWrapper() {
  const pathname = usePathname();
  
  // Ocultar en rutas de admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <ViewModeToggle />;
}
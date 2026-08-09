'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ViewMode = 'auto' | 'mobile' | 'desktop';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isDesktop: boolean;
  isMobile: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('auto');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('viewMode') as ViewMode;
    if (saved && ['auto', 'mobile', 'desktop'].includes(saved)) {
      setViewModeState(saved);
    }
    setIsClient(true);
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('viewMode', mode);
  };

  const isDesktop = viewMode === 'desktop' || (viewMode === 'auto' && isClient && window.innerWidth >= 1024);
  const isMobile = viewMode === 'mobile' || (viewMode === 'auto' && isClient && window.innerWidth < 1024);

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, isDesktop, isMobile }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
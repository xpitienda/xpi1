'use client';

import { useViewMode } from '@/lib/view-mode-context';

export default function ViewModeToggle() {
  const { viewMode, setViewMode } = useViewMode();

  const getNextMode = () => {
    if (viewMode === 'auto') return 'desktop';
    if (viewMode === 'desktop') return 'mobile';
    return 'auto';
  };

  const getIcon = () => {
    if (viewMode === 'auto') return '🤖';
    if (viewMode === 'desktop') return '💻';
    return '📱';
  };

  const getLabel = () => {
    if (viewMode === 'auto') return 'Auto';
    if (viewMode === 'desktop') return 'PC';
    return 'Móvil';
  };

  const handleToggle = () => {
    setViewMode(getNextMode());
  };

  return (
    <button
      onClick={handleToggle}
      title={`Modo: ${getLabel()}. Clic para cambiar`}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: viewMode === 'auto' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : viewMode === 'desktop'
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'all 0.3s ease',
      }}
    >
      {getIcon()}
    </button>
  );
}
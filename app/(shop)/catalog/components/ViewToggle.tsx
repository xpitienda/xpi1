'use client';

interface ViewToggleProps {
  currentView: 'carousel' | 'list';
  onViewChange: (view: 'carousel' | 'list') => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '2rem',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <span style={{
        color: '#6b7280',
        fontSize: '0.875rem',
        fontWeight: '600',
      }}>
        Ver como:
      </span>
      
      <button
        onClick={() => onViewChange('carousel')}
        style={{
          padding: '0.75rem 1.5rem',
          background: currentView === 'carousel' ? '#9333ea' : 'white',
          color: currentView === 'carousel' ? 'white' : '#1f2937',
          border: `2px solid ${currentView === 'carousel' ? '#9333ea' : '#e5e7eb'}`,
          borderRadius: '0.75rem',
          fontWeight: currentView === 'carousel' ? 'bold' : '600',
          cursor: 'pointer',
          fontSize: '0.875rem',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>🎠</span>
        <span>Carrusel</span>
      </button>
      
      <button
        onClick={() => onViewChange('list')}
        style={{
          padding: '0.75rem 1.5rem',
          background: currentView === 'list' ? '#9333ea' : 'white',
          color: currentView === 'list' ? 'white' : '#1f2937',
          border: `2px solid ${currentView === 'list' ? '#9333ea' : '#e5e7eb'}`,
          borderRadius: '0.75rem',
          fontWeight: currentView === 'list' ? 'bold' : '600',
          cursor: 'pointer',
          fontSize: '0.875rem',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>📋</span>
        <span>Lista</span>
      </button>
    </div>
  );
}
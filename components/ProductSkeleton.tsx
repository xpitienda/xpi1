export default function ProductSkeleton() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      animation: 'pulse 2s ease-in-out infinite'
    }}>
      <div style={{
        width: '100%',
        height: '200px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '0.5rem',
        marginBottom: '0.75rem'
      }}></div>

      <div style={{
        height: '1.5rem',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem',
        width: '80%'
      }}></div>

      <div style={{
        height: '1rem',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem',
        width: '100%'
      }}></div>

      <div style={{
        height: '1rem',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '0.25rem',
        marginBottom: '0.75rem',
        width: '60%'
      }}></div>

      <div style={{
        height: '1.75rem',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '0.25rem',
        width: '40%'
      }}></div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
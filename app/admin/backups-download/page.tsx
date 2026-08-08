// app/admin/backups-download/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BackupsDownloadPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Simular progreso mientras se genera el backup
  useEffect(() => {
    if (!creating) return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      const increment = Math.random() * 3 + 1;
      currentProgress = Math.min(currentProgress + increment, 95);
      setProgress(currentProgress);
    }, 500);

    return () => clearInterval(interval);
  }, [creating]);

  const handleCreateBackup = async () => {
    const confirm = window.confirm(
      '¿Crear un nuevo backup y descargarlo como ZIP?\n\n' +
      'Esto descargará:\n' +
      '• Toda la base de datos de Turso\n' +
      '• Todas las imágenes de Cloudflare R2\n' +
      '• Instrucciones de restauración\n\n' +
      'El archivo ZIP se guardará en tu carpeta de Descargas.\n\n' +
      '¿Continuar?'
    );

    if (!confirm) return;

    setCreating(true);
    setProgress(0);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/backups-download', {
        method: 'POST',
      });

      if (res.ok) {
        setProgress(100);
        
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xpitienda-backup-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setMessage('✅ Backup descargado exitosamente en tu carpeta de Descargas');
      } else {
        const data = await res.json();
        setError(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setError(` Error de conexión: ${err.message}`);
    } finally {
      setTimeout(() => setCreating(false), 1000);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 33) return '#3b82f6';
    if (progress < 66) return '#10b981';
    return '#9333ea';
  };

  const getProgressBackground = (progress: number) => {
    if (progress < 33) return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
    if (progress < 66) return 'linear-gradient(90deg, #10b981, #34d399)';
    return 'linear-gradient(90deg, #9333ea, #a855f7)';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #faf5ff, #f0fdf4)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => router.push('/admin')}
          style={{
            marginBottom: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#7e22ce',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>←</span>
          <span>Volver al Panel Admin</span>
        </button>

        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          border: '2px solid #d8b4fe'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#7e22ce',
            marginBottom: '0.5rem'
          }}>
            📦 Backup con Descarga ZIP
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Crea un respaldo completo de tu tienda y descárgalo como archivo ZIP
          </p>

          <button
            onClick={handleCreateBackup}
            disabled={creating}
            style={{
              width: '100%',
              padding: '1rem',
              background: creating ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: creating ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: creating ? '1.5rem' : '2rem',
              transition: 'all 0.2s'
            }}
          >
            {creating ? (
              <>
                <span>⏳</span>
                <span>Creando backup... (esto puede tardar varios minutos)</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Crear y Descargar Backup ZIP</span>
              </>
            )}
          </button>

          {/* Barra de progreso */}
          {creating && (
            <div style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '0.75rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: '#374151'
              }}>
                <span>Progreso del backup</span>
                <span style={{ color: getProgressColor(progress) }}>
                  {Math.round(progress)}%
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '2rem',
                background: '#e5e7eb',
                borderRadius: '1rem',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: getProgressBackground(progress),
                  borderRadius: '1rem',
                  transition: 'width 0.5s ease, background 0.5s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 2s infinite'
                  }} />
                  
                  {progress > 10 && (
                    <span style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      zIndex: 1
                    }}>
                      {Math.round(progress)}%
                    </span>
                  )}
                </div>
              </div>

              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: '#6b7280',
                textAlign: 'center'
              }}>
                {progress < 10 && '📊 Exportando base de datos...'}
                {progress >= 10 && progress < 90 && `🖼️ Descargando imágenes (${Math.round((progress - 10) / 80 * 100)}% de imágenes)`}
                {progress >= 90 && '📦 Comprimiendo archivo ZIP...'}
              </div>
            </div>
          )}

          {message && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#dcfce7',
              border: '2px solid #86efac',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#166534', fontWeight: '500', margin: 0 }}>
                {message}
              </p>
            </div>
          )}

          {error && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#fee2e2',
              border: '2px solid #fca5a5',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#991b1b', fontWeight: '500', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          <div style={{
            padding: '1rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: '#92400e', fontSize: '0.875rem', margin: 0 }}>
              ℹ️ <strong>Contenido del ZIP:</strong><br/>
              • <code>database-backup.sql</code> - Base de datos completa<br/>
              • <code>r2-images/</code> - Todas las imágenes de Cloudflare R2<br/>
              • <code>RESTAURAR.md</code> - Instrucciones paso a paso<br/>
              • <code>backup-info.json</code> - Metadatos del backup<br/><br/>
              El archivo se guardará automáticamente en tu carpeta de <strong>Descargas</strong>.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
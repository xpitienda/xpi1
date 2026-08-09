// app/admin/backups-history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Backup {
  key: string;
  name: string;
  size: number;
  lastModified: string;
}

export default function BackupsHistoryPage() {
  const router = useRouter();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const res = await fetch('/api/admin/backups');
      const data = await res.json();
      
      if (res.ok) {
        setBackups(data.sort((a: Backup, b: Backup) => 
          new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        ));
      } else {
        setError(data.error || 'Error cargando backups');
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (backup: Backup) => {
    const url = `/api/admin/backups/download?key=${encodeURIComponent(backup.key)}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (backup: Backup) => {
    const confirm = window.confirm(`¿Eliminar permanentemente ${backup.name}?`);
    if (!confirm) return;

    setDeleting(backup.key);
    try {
      const res = await fetch(`/api/admin/backups?key=${encodeURIComponent(backup.key)}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Backup ${backup.name} eliminado`);
        setBackups(prev => prev.filter(b => b.key !== backup.key));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setError(`❌ Error de conexión: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #faf5ff, #f0fdf4)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
            📦 Historial de Backups Automáticos
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Gestiona y restaura los backups automáticos de tu tienda
          </p>

          {message && (
            <div style={{
              padding: '1rem',
              background: '#dcfce7',
              border: '2px solid #86efac',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{ color: '#166534', fontWeight: '500', margin: 0 }}>{message}</p>
            </div>
          )}

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee2e2',
              border: '2px solid #fca5a5',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{ color: '#991b1b', fontWeight: '500', margin: 0 }}>{error}</p>
            </div>
          )}

          {backups.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              background: '#f9fafb',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <p style={{ color: '#6b7280' }}>No hay backups automáticos disponibles</p>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                Los backups se crean automáticamente según tu programación
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {backups.map((backup) => (
                <div
                  key={backup.key}
                  style={{
                    padding: '1.5rem',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}>
                      📄 {backup.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      🕐 {formatDate(backup.lastModified)}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 'bold' }}>
                      💾 {formatSize(backup.size)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleDownload(backup)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>📥</span>
                      <span>Descargar</span>
                    </button>

                    <button
                      onClick={() => handleDelete(backup)}
                      disabled={deleting === backup.key}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: deleting === backup.key ? '#9ca3af' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: deleting === backup.key ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: deleting === backup.key ? 0.6 : 1
                      }}
                    >
                      <span>🗑️</span>
                      <span>{deleting === backup.key ? 'Eliminando...' : 'Eliminar'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: '#92400e', fontSize: '0.875rem', margin: 0 }}>
              ℹ️ <strong>Información:</strong><br/>
              • Los backups se crean automáticamente según tu programación<br/>
              • Puedes descargarlos para tener una copia local<br/>
              • Elimina los backups antiguos para liberar espacio<br/>
              • Cada backup contiene: base de datos completa + todas las imágenes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
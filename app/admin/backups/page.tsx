// app/admin/backups/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Backup {
  name: string;
  date: string;
  size: number;
  sizeMB: number;
  files: number;
  metadata: any;
}

export default function BackupsPage() {
  const router = useRouter();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/backups/list');
      const data = await res.json();
      
      if (res.ok) {
        setBackups(data.backups || []);
      } else {
        setError(data.error || 'Error cargando backups');
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const handleCreateBackup = async () => {
    const confirm = window.confirm(
      '¿Crear un nuevo backup ahora?\n\n' +
      'Esto descargará:\n' +
      '• Toda la base de datos de Turso\n' +
      '• Todas las imágenes de Cloudflare R2\n\n' +
      '¿Continuar?'
    );

    if (!confirm) return;

    setCreating(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/backups/create', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          `✅ Backup creado exitosamente!\n\n` +
          `📁 Carpeta: ${data.folder}\n` +
          `📊 Tablas: ${data.tables}\n` +
          `🖼️ Imágenes: ${data.images}`
        );
        loadBackups(); // Recargar lista
      } else {
        setError(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setError(`❌ Error de conexión: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #faf5ff, #f0fdf4)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Botón de regreso */}
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
            💾 Gestión de Backups
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Crea y administra respaldos de tu base de datos e imágenes
          </p>

          {/* Botón de crear backup */}
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
              marginBottom: '2rem',
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
                <span>Crear Backup Manual Ahora</span>
              </>
            )}
          </button>

          {/* Mensajes */}
          {message && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#dcfce7',
              border: '2px solid #86efac',
              borderRadius: '0.5rem'
            }}>
              <pre style={{
                color: '#166534',
                whiteSpace: 'pre-wrap',
                fontWeight: '500',
                margin: 0
              }}>
                {message}
              </pre>
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

          {/* Lista de backups */}
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            📂 Backups Existentes ({backups.length})
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Cargando backups...
            </div>
          ) : backups.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              background: '#f3f4f6',
              borderRadius: '0.5rem',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
              <p>No hay backups creados aún</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Haz clic en "Crear Backup Manual Ahora" para empezar
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {backups.map((backup, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    background: idx === 0 ? '#f0fdf4' : '#f9fafb',
                    border: idx === 0 ? '2px solid #86efac' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                      {idx === 0 && <span style={{ color: '#10b981', marginRight: '0.5rem' }}> </span>}
                      {backup.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      📅 {formatDate(backup.date)} • 
                      💾 {backup.sizeMB} MB • 
                      📁 {backup.files} archivos
                    </div>
                    {backup.metadata && (
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                        Tablas: {backup.metadata.tables} • Imágenes: {backup.metadata.imagesDownloaded}
                      </div>
                    )}
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: '#e0e7ff',
                    color: '#4338ca',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {idx === 0 ? 'Más reciente' : 'Anterior'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Información adicional */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: '#92400e', fontSize: '0.875rem', margin: 0 }}>
              ℹ️ <strong>Información:</strong> Los backups se guardan en la carpeta <code>C:\dev\xpitienda\backups</code> de tu computadora. 
              Cada backup incluye la base de datos completa y todas las imágenes de Cloudflare R2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
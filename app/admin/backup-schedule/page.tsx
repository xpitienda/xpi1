// app/admin/backup-schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BackupSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [config, setConfig] = useState({
    frequency: 'weekly',
    day_of_week: 'sunday',
    day_of_month: 1,
    hour: 2,
    enabled: 1,
    last_backup_at: null as string | null,
    last_backup_status: 'pending',
    last_backup_size: 0,
    last_backup_error: null as string | null,
    next_backup_at: null as string | null,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/admin/backup-schedule');
      const data = await res.json();
      
      if (res.ok) {
        setConfig(data);
      } else {
        setError(data.error || 'Error cargando configuración');
      }
    } catch (err: any) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/backup-schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Configuración guardada exitosamente');
        setConfig(prev => ({ ...prev, next_backup_at: data.nextBackup }));
      } else {
        setError(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setError(`❌ Error de conexión: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('es-CO');
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success') return '✅';
    if (status === 'failed') return '❌';
    return '⏳';
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
            ⏰ Programación de Backups Automáticos
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Configura cuándo se deben realizar los backups automáticos
          </p>

          {/* Estado actual */}
          <div style={{
            padding: '1rem',
            background: '#f0fdf4',
            border: '2px solid #86efac',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>📊 Estado Actual</h3>
            <p style={{ color: '#166534', margin: '0.25rem 0' }}>
              <strong>Último backup:</strong> {formatDate(config.last_backup_at)}
            </p>
            <p style={{ color: '#166534', margin: '0.25rem 0' }}>
              <strong>Estado:</strong> {getStatusIcon(config.last_backup_status)} {config.last_backup_status}
            </p>
            {config.last_backup_size > 0 && (
              <p style={{ color: '#166534', margin: '0.25rem 0' }}>
                <strong>Tamaño:</strong> {formatSize(config.last_backup_size)}
              </p>
            )}
            {config.last_backup_error && (
              <p style={{ color: '#dc2626', margin: '0.25rem 0' }}>
                <strong>Error:</strong> {config.last_backup_error}
              </p>
            )}
            <p style={{ color: '#166534', margin: '0.25rem 0' }}>
              <strong>Próximo backup:</strong> {formatDate(config.next_backup_at)}
            </p>
            <p style={{ color: '#166534', margin: '0.25rem 0' }}>
              <strong>Activado:</strong> {config.enabled ? '✅ Sí' : '❌ No'}
            </p>
          </div>

          {/* Configuración */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Frecuencia
            </label>
            <select
              value={config.frequency}
              onChange={(e) => setConfig(prev => ({ ...prev, frequency: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                background: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quincenal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          {config.frequency !== 'monthly' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Día de la semana
              </label>
              <select
                value={config.day_of_week}
                onChange={(e) => setConfig(prev => ({ ...prev, day_of_week: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  background: 'white',
                  fontSize: '1rem'
                }}
              >
                <option value="monday">Lunes</option>
                <option value="tuesday">Martes</option>
                <option value="wednesday">Miércoles</option>
                <option value="thursday">Jueves</option>
                <option value="friday">Viernes</option>
                <option value="saturday">Sábado</option>
                <option value="sunday">Domingo</option>
              </select>
            </div>
          )}

          {config.frequency === 'monthly' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Día del mes (1-31)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={config.day_of_month}
                onChange={(e) => setConfig(prev => ({ ...prev, day_of_month: parseInt(e.target.value) || 1 }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Hora (0-23)
            </label>
            <input
              type="number"
              min="0"
              max="23"
              value={config.hour}
              onChange={(e) => setConfig(prev => ({ ...prev, hour: parseInt(e.target.value) || 0 }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Ejemplo: 2 = 2:00 AM, 14 = 2:00 PM
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.enabled === 1}
                onChange={(e) => setConfig(prev => ({ ...prev, enabled: e.target.checked ? 1 : 0 }))}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
              <span style={{ fontWeight: 'bold', color: '#1f2937' }}>
                {config.enabled ? '✅ Backups automáticos activados' : ' Backups automáticos desactivados'}
              </span>
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%',
              padding: '1rem',
              background: saving ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            {saving ? '💾 Guardando...' : '💾 Guardar Configuración'}
          </button>

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
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#991b1b', fontWeight: '500', margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{
            padding: '1rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.5rem'
          }}>
            <p style={{ color: '#92400e', fontSize: '0.875rem', margin: 0 }}>
              ℹ️ <strong>¿Dónde se guardan los backups?</strong><br/>
              Los backups automáticos se guardan en el bucket <code>xpitienda-backups</code> de Cloudflare R2.<br/>
              Puedes verlos en: <a href="https://dash.cloudflare.com" target="_blank" style={{ color: '#1d4ed8' }}>Cloudflare Dashboard → R2</a><br/><br/>
              <strong>¿Cómo sé si funcionó?</strong><br/>
              • Revisa el "Estado Actual" arriba (✅ success o  failed)<br/>
              • Verifica los logs en Vercel: <a href="https://vercel.com/dashboard" target="_blank" style={{ color: '#1d4ed8' }}>Vercel Dashboard</a><br/>
              • Consulta el bucket de R2 para ver los archivos ZIP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
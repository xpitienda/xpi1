'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ProcessImagesPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [watermark, setWatermark] = useState('XPI Tienda');
  const [targetSize, setTargetSize] = useState('800');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResult(null);
      setError('');
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Selecciona al menos una imagen');
      return;
    }

    setProcessing(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('watermark', watermark);
    formData.append('size', targetSize);

    try {
      const response = await fetch('/api/process-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(data.error || 'Error procesando imágenes');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadZip = () => {
    window.location.href = '/api/download-processed';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header con botón de volver */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => router.push('/admin')}
            style={{
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            ← Volver al Panel
          </button>
          
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
              🖼️ Procesador de Imágenes
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
              Redimensiona, comprime y descarga imágenes en ZIP automáticamente
            </p>
          </div>
        </div>

        {/* Panel de configuración */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#374151' }}>
            ⚙️ Configuración
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Marca de Agua:
              </label>
              <input
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }}
                placeholder="XPI Tienda"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Tamaño máximo (px):
              </label>
              <input
                type="number"
                value={targetSize}
                onChange={(e) => setTargetSize(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }}
                placeholder="800"
              />
            </div>
          </div>

          {/* Selector de archivos */}
          <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              style={{ cursor: 'pointer', display: 'block' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Haz clic para seleccionar imágenes
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Puedes seleccionar múltiples archivos a la vez
              </p>
            </label>
          </div>

          {/* Lista de archivos seleccionados */}
          {files.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                📋 Archivos seleccionados ({files.length}):
              </h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem' }}>
                {files.map((file, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', marginRight: '1rem' }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón procesar */}
          <button
            onClick={handleProcess}
            disabled={processing || files.length === 0}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '1rem',
              background: processing || files.length === 0 ? '#9ca3af' : 'linear-gradient(135deg, #1e40af, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              cursor: processing || files.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            {processing ? '⏳ Procesando...' : `🚀 Procesar ${files.length} imagen${files.length !== 1 ? 'es' : ''}`}
          </button>

          {error && (
            <div style={{ marginTop: '1rem', background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', fontWeight: '600' }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Resultados */}
        {result && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#16a34a' }}>
              ✅ Procesamiento Completado
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>{result.processed}</div>
                <div style={{ fontSize: '0.875rem', color: '#166534' }}>Procesadas</div>
              </div>
              <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>{result.errors}</div>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>Con errores</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>
                  {result.data.length > 0 ? Math.round(result.data.reduce((acc: number, p: any) => acc + p.compression, 0) / result.data.length) : 0}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>Compresión promedio</div>
              </div>
            </div>

            {/* Lista de imágenes procesadas */}
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
              📁 Imágenes guardadas temporalmente
            </h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
              {result.data.map((item: any, index: number) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>{item.processed}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Original: {item.original}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '600' }}>
                      {(item.size / 1024).toFixed(1)} KB
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      -{item.compression}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón para descargar ZIP */}
            <button
              onClick={handleDownloadZip}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              📥 Descargar todas las imágenes procesadas (.zip)
            </button>

            <p style={{ 
              textAlign: 'center', 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              marginTop: '0.5rem' 
            }}>
              El ZIP contendrá todas las imágenes comprimidas y listas para carga masiva
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
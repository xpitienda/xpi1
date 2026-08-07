'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

interface ProcessedImage {
  originalName: string;
  processedName: string;
  publicUrl: string;
  size: number;
}

export default function ProcessImagesCloudPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setProcessedImages([]);
      setError('');
    }
  };

  const processAndUpload = async () => {
    if (files.length === 0) {
      setError('Selecciona al menos una imagen');
      return;
    }

    setProcessing(true);
    setError('');
    setProgress({ current: 0, total: files.length });
    setProcessedImages([]);

    const results: ProcessedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Paso 1: Comprimir imagen en el navegador
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5, // Máximo 500KB
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: 'image/jpeg',
        });

        // Paso 2: Obtener presigned URL de R2
        const presignedResponse = await fetch('/api/r2-presigned-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: compressedFile.type,
          }),
        });

        const presignedData = await presignedResponse.json();

        if (!presignedData.success) {
          throw new Error(presignedData.error || 'Error obteniendo URL');
        }

        // Paso 3: Subir imagen directamente a R2
        const uploadResponse = await fetch(presignedData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/jpeg' },
          body: compressedFile,
        });

        if (!uploadResponse.ok) {
          throw new Error('Error subiendo a R2');
        }

        results.push({
          originalName: file.name,
          processedName: presignedData.filename,
          publicUrl: presignedData.publicUrl,
          size: compressedFile.size,
        });

        setProgress({ current: i + 1, total: files.length });
        setProcessedImages([...results]);

      } catch (err) {
        console.error(`Error procesando ${file.name}:`, err);
        setError(`Error con ${file.name}: ${(err as Error).message}`);
      }
    }

    setProcessing(false);
  };

  const downloadCSV = () => {
    if (processedImages.length === 0) return;

    const csvContent = [
      'name,image_url,category,price,stock',
      ...processedImages.map(img => {
        const name = img.originalName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
        return `"${name}","${img.publicUrl}","General",0,10`;
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `productos_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            }}
          >
            ← Volver al Panel
          </button>
          
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
              🖼️ Procesador de Imágenes Cloud
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
              Comprime y sube imágenes directamente a Cloudflare R2
            </p>
          </div>
        </div>

        {/* Panel de configuración */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#374151' }}>
            ️ Subir Imágenes
          </h2>

          {/* Selector de archivos */}
          <div style={{ border: '2px dashed #d1d5db', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-upload-cloud"
            />
            <label htmlFor="file-upload-cloud" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Haz clic para seleccionar imágenes
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Se comprimirán y subirán automáticamente a la nube
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                📋 Archivos seleccionados ({files.length})
              </h3>
              
              <button
                onClick={processAndUpload}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: processing ? '#9ca3af' : 'linear-gradient(135deg, #1e40af, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  cursor: processing ? 'not-allowed' : 'pointer',
                }}
              >
                {processing ? `⏳ Procesando ${progress.current} de ${progress.total}...` : `🚀 Procesar y Subir ${files.length} imágenes`}
              </button>
            </div>
          )}

          {/* Barra de progreso */}
          {processing && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ background: '#e5e7eb', borderRadius: '9999px', height: '1.5rem', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    transition: 'width 0.3s',
                  }}
                >
                  {Math.round((progress.current / progress.total) * 100)}%
                </div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#6b7280' }}>
                Imagen {progress.current} de {progress.total}
              </p>
            </div>
          )}

          {error && (
            <div style={{ marginTop: '1rem', background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', fontWeight: '600' }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Resultados */}
        {processedImages.length > 0 && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#16a34a' }}>
              ✅ Procesamiento Completado
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>{processedImages.length}</div>
                <div style={{ fontSize: '0.875rem', color: '#166534' }}>Imágenes subidas a R2</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>
                  {(processedImages.reduce((acc, img) => acc + img.size, 0) / 1024).toFixed(1)} KB
                </div>
                <div style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>Tamaño total</div>
              </div>
            </div>

            {/* Botón descargar CSV */}
            <button
              onClick={downloadCSV}
              style={{
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
              }}
            >
              📥 Descargar CSV para Importación
            </button>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              El CSV contiene las URLs de Cloudflare R2 listas para importar
            </p>

            {/* Lista de imágenes */}
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', marginTop: '1.5rem' }}>
              📁 Imágenes procesadas
            </h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
              {processedImages.map((img, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>{img.processedName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Original: {img.originalName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: '600' }}>
                      {(img.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
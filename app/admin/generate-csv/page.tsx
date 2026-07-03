'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateCsvPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setLoading(true); 
    setMessage(null); 
    setUrls([]);
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const res = await fetch('/api/admin/batch-upload', { 
        method: 'POST', 
        body: formData 
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setUrls(data.urls);
        setMessage({ type: 'success', text: `✅ ${data.count} imágenes subidas.` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al subir' });
      }
    } catch (err: any) { 
      setMessage({ type: 'error', text: err.message }); 
    } finally { 
      setLoading(false); 
    }
  };

  const downloadCsv = () => {
    if (urls.length === 0) return;
    
    let csv = "image_url,name,price,stock,description,category\n";
    
    urls.forEach(u => {
      const name = u.originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      csv += `${u.url},"${name}",0,1,"Descripción pendiente","General"\n`;
    });

    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = "productos_con_urls.csv";
    link.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px' }}>
        <h1 style={{ color: '#3D1A78', marginBottom: '1rem' }}>📸 Generar CSV desde Fotos</h1>
        <p style={{ marginBottom: '1rem' }}>Sube tus fotos. Te daremos un CSV con las URLs listas para que solo llenes precios en Excel.</p>
        
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={loading} 
          style={{ width: '100%', padding: '1rem', border: '2px dashed #ccc', borderRadius: '8px', marginBottom: '1rem' }} 
        />
        
        {message && (
          <div style={{ 
            padding: '1rem', 
            background: message.type==='success' ? '#dcfce7' : '#fee2e2', 
            borderRadius:'8px', 
            marginBottom:'1rem' 
          }}>
            {message.text}
          </div>
        )}
        
        {urls.length > 0 && (
          <button 
            onClick={downloadCsv} 
            style={{ 
              background: '#10B981', 
              color: 'white', 
              padding: '1rem 2rem', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 'bold', 
              fontSize: '1.1rem', 
              cursor: 'pointer' 
            }}
          >
             Descargar CSV con URLs
          </button>
        )}
        
        <button 
          onClick={() => router.push('/admin')} 
          style={{ 
            marginTop: '2rem', 
            background: '#eee', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            cursor: 'pointer' 
          }}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}

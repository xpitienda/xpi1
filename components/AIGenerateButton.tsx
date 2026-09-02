'use client';

import { useState } from 'react';

interface AIGenerateButtonProps {
  productId: string;
  imageUrl: string;
  productName: string;
  onSuccess: () => void;
}

export default function AIGenerateButton({ 
  productId,
  imageUrl,
  productName,
  onSuccess 
}: AIGenerateButtonProps) {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleGenerate = async () => {
    if (!imageUrl) {
      setMessage({ type: 'error', text: 'No hay imagen principal para generar variaciones' });
      return;
    }

    setGenerating(true);
    setMessage(null);

    try {
      // 1. Llamar a la API de generación de imágenes
      const res = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          productName: productName
        })
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al generar imágenes');
      }

      setMessage({ 
        type: 'success', 
        text: `✅ Se generaron ${data.count} variaciones. Subiendo al producto...` 
      });

      // 2. Subir las imágenes generadas al producto
      for (let i = 0; i < data.images.length; i++) {
        const genImageUrl = data.images[i];
        
        await fetch('/api/admin/product-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
          },
          body: JSON.stringify({
            product_id: productId,
            image_url: genImageUrl,
            display_order: i
          })
        });
      }

      setMessage({ 
        type: 'success', 
        text: `✅ ¡Éxito! ${data.count} variaciones agregadas al carrusel` 
      });

      // 3. Llamar al callback para recargar imágenes
      onSuccess();

    } catch (error: any) {
      console.error('Error generando imágenes:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al generar imágenes con IA' 
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        onClick={handleGenerate}
        disabled={generating || !imageUrl}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '1rem',
          background: generating || !imageUrl ? '#9ca3af' : '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '0.95rem',
          cursor: generating || !imageUrl ? 'not-allowed' : 'pointer',
          opacity: generating || !imageUrl ? 0.7 : 1,
          transition: 'all 0.2s',
          boxShadow: '0 4px 6px rgba(139, 92, 246, 0.2)'
        }}
        onMouseEnter={(e) => {
          if (!generating && imageUrl) {
            (e.currentTarget as HTMLElement).style.background = '#7c3aed';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!generating && imageUrl) {
            (e.currentTarget as HTMLElement).style.background = '#8b5cf6';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }
        }}
      >
        {generating ? (
          <>
            <span>⏳</span>
            <span>Generando 5 variaciones con IA...</span>
          </>
        ) : (
          <>
            <span>🤖</span>
            <span>Generar 5 variaciones con IA</span>
          </>
        )}
      </button>

      {message && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          borderRadius: '6px',
          background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b',
          fontSize: '0.85rem',
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      <p style={{
        marginTop: '0.5rem',
        fontSize: '0.8rem',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        💡 La IA creará 5 ángulos diferentes basados en tu imagen principal
      </p>
    </div>
  );
}

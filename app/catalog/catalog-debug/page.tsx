// app/catalog-debug/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function CatalogDebug() {
  const [products, setProducts] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        
        // Verificar cada imagen
        data.products?.forEach((p: any) => {
          const img = new Image();
          img.onload = () => console.log(`✅ ${p.name}: OK`);
          img.onerror = (e) => {
            console.error(`❌ ${p.name}: Error cargando imagen`, p.image_url);
            setErrors(prev => ({ ...prev, [p.id]: 'Error al cargar' }));
          };
          img.src = p.image_url;
        });
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug de Imágenes</h1>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <p><strong>{product.name}</strong></p>
            <p className="text-sm text-gray-500 break-all">{product.image_url}</p>
            
            {errors[product.id] ? (
              <p className="text-red-500 mt-2">❌ {errors[product.id]}</p>
            ) : (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="mt-2 max-w-xs border"
                onError={(e) => {
                  console.error('Error cargando:', product.image_url);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
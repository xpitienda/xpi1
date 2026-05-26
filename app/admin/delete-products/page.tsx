// app/admin/delete-products/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function DeleteProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar productos
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, []);

  // Eliminar producto
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert('✅ Producto eliminado');
      } else {
        alert('❌ Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      alert('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🗑️ Gestionar Productos</h1>
      
      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos</p>
      ) : (
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-16 h-16 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                }}
              />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">${Number(product.price).toFixed(2)}</p>
                <p className="text-xs text-gray-400 break-all">{product.image_url}</p>
              </div>
              <button
                onClick={() => handleDelete(product.id, product.name)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
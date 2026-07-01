'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface BatchItem {
  file: File;
  preview: string;
  name: string;
  price: string;
  description: string;
  stock: string;
  category: string;
  uploading: boolean;
  uploaded: boolean;
  imageUrl?: string;
  error?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  
  // Estado para modo individual
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para modo masivo
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchMessage, setBatchMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA MODO INDIVIDUAL (EXISTENTE) ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'La imagen no debe superar los 5MB' });
        return;
      }
      setPreview(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const handleSubmitSingle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const file = formData.get('image') as File;

      if (!file || file.size === 0) {
        setMessage({ type: 'error', text: 'Selecciona una imagen del producto' });
        setLoading(false);
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append('file', file);

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: imageFormData });
      const uploadData = await uploadRes.json();

      if (!uploadData.url) throw new Error(uploadData.error || 'Error al subir imagen');

      const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        image_url: uploadData.url,
      };

      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const productDataRes = await productRes.json();
      if (!productRes.ok) throw new Error(productDataRes.error || 'Error al guardar producto');

      setMessage({ type: 'success', text: '✅ Producto guardado exitosamente' });
      form.reset();
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : ' Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA MODO MASIVO (NUEVO) ---
  const handleBatchFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: BatchItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "), // Limpia nombre de archivo
      price: '',
      description: '',
      stock: '1',
      category: 'General',
      uploading: false,
      uploaded: false,
    }));

    setBatchItems(prev => [...prev, ...newItems]);
    setBatchMessage(null);
    if (batchFileInputRef.current) batchFileInputRef.current.value = '';
  };

  const updateBatchItem = (index: number, field: keyof BatchItem, value: string) => {
    setBatchItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeBatchItem = (index: number) => {
    setBatchItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchSubmit = async () => {
    // Validar que todos tengan precio y nombre
    const invalid = batchItems.some(i => !i.name.trim() || !i.price.trim());
    if (invalid) {
      setBatchMessage({ type: 'error', text: 'Todos los productos deben tener Nombre y Precio' });
      return;
    }

    setBatchLoading(true);
    setBatchMessage(null);

    try {
      // 1. Subir todas las imágenes primero
      const itemsWithUrls = await Promise.all(batchItems.map(async (item, idx) => {
        try {
          setBatchItems(prev => prev.map((it, i) => i === idx ? { ...it, uploading: true } : it));
          
          const formData = new FormData();
          formData.append('file', item.file);
          
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          
          if (!data.url) throw new Error('Error subiendo imagen');
          
          setBatchItems(prev => prev.map((it, i) => i === idx ? { ...it, uploading: false, uploaded: true, imageUrl: data.url } : it));
          return { ...item, imageUrl: data.url };
        } catch (err) {
          setBatchItems(prev => prev.map((it, i) => i === idx ? { ...it, uploading: false, error: 'Error al subir' } : it));
          throw err;
        }
      }));

      // 2. Guardar productos en base de datos
      const productsToSave = itemsWithUrls.map(item => ({
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        image_url: item.imageUrl,
        category: item.category
      }));

      const saveRes = await fetch('/api/admin/batch-products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        },
        body: JSON.stringify({ products: productsToSave }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error);

      setBatchMessage({ type: 'success', text: `✅ ${saveData.count} productos guardados correctamente` });
      setBatchItems([]); // Limpiar lista

    } catch (error: any) {
      setBatchMessage({ type: 'error', text: error.message || 'Error al procesar lote' });
    } finally {
      setBatchLoading(false);
    }
  };

  // --- RENDERIZADO ---
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Selector de Modo */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'white', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <button 
            onClick={() => setMode('single')}
            style={{ 
              flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
              background: mode === 'single' ? '#3D1A78' : 'transparent', color: mode === 'single' ? 'white' : '#666'
            }}
          >
            ➕ Agregar Uno (Normal)
          </button>
          <button 
            onClick={() => setMode('batch')}
            style={{ 
              flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
              background: mode === 'batch' ? '#006B3C' : 'transparent', color: mode === 'batch' ? 'white' : '#666'
            }}
          >
             Carga Masiva (Lote)
          </button>
        </div>

        {/* MODO INDIVIDUAL (TU CÓDIGO ORIGINAL) */}
        {mode === 'single' && (
          <div className="max-w-2xl mx-auto">
            {message && (
              <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmitSingle} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D1A78', margin: 0 }}>Nuevo Producto</h2>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Imagen *</label>
                <input ref={fileInputRef} type="file" name="image" accept="image/*" onChange={handleImageChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} />
                {preview && <img src={preview} alt="Preview" style={{ marginTop: '1rem', width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre *</label>
                <input type="text" name="name" placeholder="Ej: Jeans Skinny Negro" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descripción</label>
                <textarea name="description" rows={3} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Precio ($) *</label>
                  <input type="number" name="price" step="0.01" min="0" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock</label>
                  <input type="number" name="stock" defaultValue="0" min="0" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ background: '#3D1A78', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? ' Guardando...' : '💾 Guardar Producto'}
              </button>
            </form>
          </div>
        )}

        {/* MODO MASIVO (NUEVO) */}
        {mode === 'batch' && (
          <div>
            {batchMessage && (
              <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: batchMessage.type === 'success' ? '#dcfce7' : '#fee2e2', color: batchMessage.type === 'success' ? '#166534' : '#991b1b' }}>
                {batchMessage.text}
              </div>
            )}

            {/* Área de carga de archivos */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center', border: '2px dashed #ccc', marginBottom: '2rem' }}>
              <input 
                ref={batchFileInputRef}
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleBatchFiles} 
                style={{ display: 'none' }} 
                id="batch-upload"
              />
              <label htmlFor="batch-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                <p style={{ fontWeight: 'bold', color: '#3D1A78', margin: '0 0 0.5rem 0' }}>Haz clic para seleccionar múltiples imágenes</p>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>O arrastra tus fotos aquí (JPG, PNG, WebP)</p>
              </label>
            </div>

            {/* Lista de productos pendientes */}
            {batchItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {batchItems.map((item, index) => (
                  <div key={index} style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', alignItems: 'start', border: item.uploading ? '2px solid #F59E0B' : item.uploaded ? '2px solid #10B981' : '1px solid #eee' }}>
                    
                    {/* Preview Imagen */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={item.preview} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                      {item.uploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>⏳</div>}
                      {item.uploaded && <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#10B981', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>}
                    </div>

                    {/* Campos de edición rápida */}
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Nombre del producto" 
                        value={item.name} 
                        onChange={(e) => updateBatchItem(index, 'name', e.target.value)}
                        style={{ gridColumn: '1 / -1', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
                      />
                      <input 
                        type="number" 
                        placeholder="Precio" 
                        value={item.price} 
                        onChange={(e) => updateBatchItem(index, 'price', e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
                      />
                      <input 
                        type="number" 
                        placeholder="Stock" 
                        value={item.stock} 
                        onChange={(e) => updateBatchItem(index, 'stock', e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
                      />
                      <select 
                        value={item.category} 
                        onChange={(e) => updateBatchItem(index, 'category', e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', gridColumn: '1 / -1' }}
                      >
                        <option value="General">General</option>
                        <option value="Ropa">Ropa</option>
                        <option value="Calzado">Calzado</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Tecnologia">Tecnología</option>
                        <option value="Deportes">Deportes</option>
                        <option value="Hogar">Hogar</option>
                        <option value="Bisutería">Bisutería</option>
                      </select>
                      <textarea 
                        placeholder="Descripción breve..." 
                        value={item.description} 
                        onChange={(e) => updateBatchItem(index, 'description', e.target.value)}
                        rows={1}
                        style={{ gridColumn: '1 / -1', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical' }}
                      />
                    </div>

                    {/* Botón eliminar */}
                    <button 
                      onClick={() => removeBatchItem(index)}
                      style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Botón Guardar Todo */}
                <button 
                  onClick={handleBatchSubmit}
                  disabled={batchLoading || batchItems.length === 0}
                  style={{ 
                    background: '#006B3C', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', 
                    fontWeight: 'bold', fontSize: '1.1rem', cursor: batchLoading ? 'not-allowed' : 'pointer', 
                    opacity: batchLoading ? 0.7 : 1, marginTop: '1rem', boxShadow: '0 4px 6px rgba(0,107,60,0.3)'
                  }}
                >
                  {batchLoading ? '⏳ Subiendo y guardando...' : `🚀 Guardar ${batchItems.length} Productos`}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

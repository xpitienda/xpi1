'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Sparkles } from 'lucide-react';

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
}

interface AdditionalImage {
  id: number;
  product_id: string;
  image_url: string;
  display_order: number;
}

export default function AddProductPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>([]);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  const [bulkName, setBulkName] = useState('');
  const [bulkCategory, setBulkCategory] = useState('General');
  const [bulkDescription, setBulkDescription] = useState('Producto de alta calidad. Consulte disponibilidad.');
  const [bulkPrice, setBulkPrice] = useState(0);
  const [bulkStock, setBulkStock] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories', {
          headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const categoryNames = data.map((c: any) => c.name);
          setCategories(categoryNames);
          if (categoryNames.length > 0 && bulkCategory === 'General') {
            setBulkCategory(categoryNames[0]);
          }
        }
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (createdProductId) {
      loadAdditionalImages(createdProductId);
    }
  }, [createdProductId]);

  const loadAdditionalImages = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/product-images?product_id=${productId}`, {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const data = await res.json();
      if (data.success) {
        setAdditionalImages(data.images);
      }
    } catch (err) {
      console.error('Error cargando imágenes adicionales:', err);
    }
  };

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
    setCreatedProductId(null);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const file = formData.get('image') as File;

      if (!file || file.size === 0) {
        setMessage({ type: 'error', text: 'Selecciona una imagen' });
        setLoading(false);
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append('image', file);
      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: imageFormData,
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.url) throw new Error(uploadData.error || 'Error al subir imagen');

      const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category') || 'General',
        image_url: uploadData.url,
        is_active: 1
      };

      const productRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        },
        body: JSON.stringify(productData),
      });
      const productDataRes = await productRes.json();
      if (!productRes.ok) throw new Error(productDataRes.error || 'Error al guardar');

      setMessage({ type: 'success', text: '✅ Producto guardado exitosamente' });

      if (productDataRes.id) {
        setCreatedProductId(productDataRes.id);
      } else {
        const productName = formData.get('name') as string;
        try {
          const allRes = await fetch('/api/admin/products', {
            headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
          });
          const allData = await allRes.json();
          if (allData.products && allData.products.length > 0) {
            const match = allData.products.find((p: any) => p.name === productName);
            if (match) setCreatedProductId(match.id);
          }
        } catch (err) {
          console.error("Error buscando producto:", err);
        }
      }

      form.reset();
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !createdProductId) return;

    setUploadingAdditional(true);
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`La imagen ${file.name} supera los 5MB`);
          continue;
        }

        const imgFormData = new FormData();
        imgFormData.append('image', file);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: imgFormData,
          headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
        });
        const uploadData = await uploadRes.json();

        if (uploadData.url) {
          const order = additionalImages.length;
          await fetch('/api/admin/product-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
            },
            body: JSON.stringify({
              product_id: createdProductId,
              image_url: uploadData.url,
              display_order: order
            })
          });
        }
      }

      await loadAdditionalImages(createdProductId);
      if (additionalFileInputRef.current) additionalFileInputRef.current.value = '';
      setMessage({ type: 'success', text: '✅ Imágenes adicionales agregadas correctamente' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al subir imágenes adicionales' });
    } finally {
      setUploadingAdditional(false);
    }
  };

  const deleteAdditionalImage = async (imageId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;
    try {
      const res = await fetch(`/api/admin/product-images?id=${imageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      if (res.ok) {
        await loadAdditionalImages(createdProductId!);
        setMessage({ type: 'success', text: '✅ Imagen eliminada' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar la imagen' });
    }
  };

  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchMessage, setBatchMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);

  const [csvData, setCsvData] = useState<any[]>([]);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvMessage, setCsvMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [assignedFiles, setAssignedFiles] = useState<Record<string, File>>({});

  const applyBulkChangesToBatch = () => {
    setBatchItems(prev => prev.map((item, idx) => ({
      ...item,
      name: bulkName.trim() ? `${bulkName.trim()} ${idx + 1}` : item.name,
      category: bulkCategory,
      description: bulkDescription,
      price: bulkPrice.toString(),
      stock: bulkStock.toString()
    })));
    
    setBatchMessage({ 
      type: 'success', 
      text: `✅ Datos aplicados a ${batchItems.length} productos` 
    });
    
    setTimeout(() => setBatchMessage(null), 3000);
  };

  const handleBatchFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('📂 Total de archivos seleccionados:', files.length);
    
    if (files.length === 0) return;
    
    const newItems: BatchItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      price: '',
      description: '',
      stock: '1',
      category: categories.length > 0 ? categories[0] : 'General',
      uploading: false,
      uploaded: false,
    }));
    
    console.log('✅ Items creados:', newItems.length);
    setBatchItems(prev => {
      const updated = [...prev, ...newItems];
      console.log('📊 Total de items en el lote:', updated.length);
      return updated;
    });
    
    setBatchMessage(null);
    if (batchFileInputRef.current) batchFileInputRef.current.value = '';
  };

  const updateBatchItem = (index: number, field: keyof BatchItem, value: string) => {
    setBatchItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeBatchItem = (index: number) => {
    setBatchItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchSubmit = async () => {
    const invalid = batchItems.some(i => !i.name.trim() || !i.price.trim());
    if (invalid) {
      setBatchMessage({ type: 'error', text: 'Todos los productos deben tener Nombre y Precio' });
      return;
    }
    setBatchLoading(true);
    setBatchMessage(null);
    try {
      const productsToSave = [];
      for (let idx = 0; idx < batchItems.length; idx++) {
        const item = batchItems[idx];
        setBatchItems(prev => prev.map((it, i) => i === idx ? { ...it, uploading: true } : it));
        const formData = new FormData();
        formData.append('image', item.file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
          headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
        });
        const data = await res.json();
        if (!data.url) throw new Error(`Error subiendo imagen de ${item.name}`);
        setBatchItems(prev => prev.map((it, i) => i === idx ? { ...it, uploading: false, uploaded: true, imageUrl: data.url } : it));
        productsToSave.push({
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          image_url: data.url,
          category: item.category,
          is_active: 1
        });
      }
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
      setBatchMessage({ type: 'success', text: `✅ ${saveData.count} productos guardados` });
      setBatchItems([]);
    } catch (error: any) {
      setBatchMessage({ type: 'error', text: error.message || 'Error al procesar lote' });
    } finally {
      setBatchLoading(false);
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvLoading(true);
    setCsvMessage(null);
    setAssignedFiles({});
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/import-csv', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCsvData(data.products);
        setCsvMessage({ type: 'success', text: `✅ Se cargaron ${data.count} productos del CSV.` });
      } else {
        setCsvMessage({ type: 'error', text: data.error || 'Error al leer CSV' });
      }
    } catch (err) {
      setCsvMessage({ type: 'error', text: 'Error de conexión al leer CSV' });
    } finally {
      setCsvLoading(false);
    }
  };

  const handleImageAssignment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAssignments: Record<string, File> = { ...assignedFiles };
    files.forEach(file => {
      const match = csvData.find(p =>
        (p.filename && p.filename.toLowerCase() === file.name.toLowerCase()) ||
        file.name.toLowerCase().includes((p.filename || p.name).toLowerCase())
      );
      if (match) newAssignments[match.name] = file;
    });
    setAssignedFiles(newAssignments);
  };

  const handleSaveCsvBatch = async () => {
    setCsvLoading(true);
    setCsvMessage(null);
    try {
      const productsToSave = [];
      for (const product of csvData) {
        let imageUrl = product.image_url || '';
        const file = assignedFiles[product.name];
        if (file) {
          const imgFormData = new FormData();
          imgFormData.append('image', file);
          const uploadRes = await fetch('/api/admin/upload', {
            method: 'POST',
            body: imgFormData,
            headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
          });
          const uploadData = await uploadRes.json();
          if (uploadData.url) imageUrl = uploadData.url;
          else throw new Error(`Error subiendo imagen para ${product.name}`);
        }
        productsToSave.push({
          name: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description,
          category: product.category,
          image_url: imageUrl,
          is_active: 1
        });
      }
      const saveRes = await fetch('/api/admin/batch-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        },
        body: JSON.stringify({ products: productsToSave })
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Error guardando productos');
      setCsvMessage({ type: 'success', text: `✅ ¡Éxito! ${saveData.count} productos creados.` });
      setCsvData([]);
      setAssignedFiles({});
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      setCsvMessage({ type: 'error', text: err.message });
    } finally {
      setCsvLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "filename,name,price,stock,description,category\nJ1.jpg,Jean Modelo 1,150000,10,Jean moderno azul,Ropa";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "plantilla_productos.csv");
    link.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => router.push('/admin')} style={{ marginBottom: '1rem', background: '#eee', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
          ← Volver al Panel
        </button>

        {/* ✅ BOTONES: Morado por defecto, Verde con hendidura al seleccionar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'white', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <button 
            onClick={() => setMode('single')} 
            style={{ 
              flex: 1, 
              padding: '1rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '1rem', 
              // ✅ Morado por defecto, Verde cuando está activo
              background: mode === 'single' ? '#10B981' : '#6B2D8B', 
              color: 'white',
              boxShadow: mode === 'single' ? 'inset 0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transform: mode === 'single' ? 'translateY(1px)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            ➕ Agregar Uno (Normal)
          </button>
          <button 
            onClick={() => setMode('batch')} 
            style={{ 
              flex: 1, 
              padding: '1rem', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '1rem',
              // ✅ Morado por defecto, Verde cuando está activo
              background: mode === 'batch' ? '#10B981' : '#6B2D8B', 
              color: 'white',
              boxShadow: mode === 'batch' ? 'inset 0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transform: mode === 'batch' ? 'translateY(1px)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            📦 Carga Masiva (Imágenes)
          </button>
        </div>

        {mode === 'single' && (
          <div>
            {message && (
              <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmitSingle} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6B2D8B', margin: 0 }}>Nuevo Producto</h2>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Imagen Principal *</label>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Precio ($) *</label>
                  <input type="number" name="price" step="0.01" min="0" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock</label>
                  <input type="number" name="stock" defaultValue="0" min="0" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Categoría</label>
                  <select name="category" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', background: 'white' }}>
                    {categories.length > 0 ? categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>)) : (<option value="General">General</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ background: '#6B2D8B', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? '⏳ Guardando...' : '💾 Guardar Producto'}
              </button>
            </form>

            {createdProductId && (
              <div style={{ marginTop: '2rem', background: '#f0fdf4', padding: '2rem', borderRadius: '12px', border: '2px solid #16a34a' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#166534', marginBottom: '1rem' }}>
                  🖼️ Imágenes Adicionales (Variantes / Colores)
                </h3>
                <p style={{ color: '#15803d', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Estas imágenes aparecerán en el carrusel 3D del producto. Sube de 1 a 5 fotos extra.
                </p>

                <input
                  ref={additionalFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAdditionalImagesUpload}
                  disabled={uploadingAdditional}
                  style={{ marginBottom: '1rem', width: '100%' }}
                />

                {uploadingAdditional && <p style={{ color: '#16a34a', fontWeight: 'bold' }}>⏳ Subiendo imágenes...</p>}

                {additionalImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    {additionalImages.map((img, idx) => (
                      <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                        <img src={img.image_url} alt={`Extra ${idx + 1}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                        <button
                          onClick={() => deleteAdditionalImage(img.id)}
                          style={{
                            position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                            border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px'
                          }}
                        >
                          ×
                        </button>
                        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.75rem', textAlign: 'center', padding: '2px' }}>
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {mode === 'batch' && (
          <div>
            {batchMessage && (
              <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: batchMessage.type === 'success' ? '#dcfce7' : '#fee2e2', color: batchMessage.type === 'success' ? '#166534' : '#991b1b' }}>
                {batchMessage.text}
              </div>
            )}
            
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <button onClick={() => setShowCsvModal(true)} style={{ background: '#3B82F6', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
                📄 Importar Datos (Excel/CSV)
              </button>
            </div>

            {batchItems.length > 0 && (
              <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '1rem',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                border: '2px solid #93c5fd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <Sparkles size={28} style={{ color: '#fde047' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                    Plantilla de Datos Masivos
                  </h3>
                </div>
                <p style={{ color: '#dbeafe', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                  Define los valores que se aplicarán a TODOS los productos del lote.
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#dbeafe', marginBottom: '0.5rem' }}>
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      value={bulkName}
                      onChange={(e) => setBulkName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'white',
                        border: '2px solid #93c5fd',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Ej: Zapatillas Nike (se numerarán automáticamente)"
                    />
                    <p style={{ color: '#bfdbfe', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                      💡 Si lo dejas vacío, se usará el nombre del archivo
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#dbeafe', marginBottom: '0.5rem' }}>
                      Categoría
                    </label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => setBulkCategory(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'white',
                        border: '2px solid #93c5fd',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}
                    >
                      {categories.length === 0 ? (
                        <option value="">Cargando...</option>
                      ) : (
                        categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#dbeafe', marginBottom: '0.5rem' }}>
                      Precio
                    </label>
                    <input
                      type="number"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(Number(e.target.value))}
                      style={{
                        width: '100%',
                        background: 'white',
                        border: '2px solid #93c5fd',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#dbeafe', marginBottom: '0.5rem' }}>
                      Stock
                    </label>
                    <input
                      type="number"
                      value={bulkStock}
                      onChange={(e) => setBulkStock(Number(e.target.value))}
                      style={{
                        width: '100%',
                        background: 'white',
                        border: '2px solid #93c5fd',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#dbeafe', marginBottom: '0.5rem' }}>
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={bulkDescription}
                      onChange={(e) => setBulkDescription(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'white',
                        border: '2px solid #93c5fd',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}
                      placeholder="Descripción del producto"
                    />
                  </div>
                </div>

                <button
                  onClick={applyBulkChangesToBatch}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)',
                    transition: 'transform 0.2s'
                  }}
                >
                  <CheckCircle size={24} />
                  Aplicar a TODOS los {batchItems.length} productos
                </button>
              </div>
            )}

            <div style={{ 
              background: 'white', 
              padding: '3rem 2rem', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
              textAlign: 'center', 
              border: batchItems.length > 0 ? '3px solid #10B981' : '3px dashed #6B2D8B', 
              marginBottom: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              <input 
                ref={batchFileInputRef} 
                type="file" 
                multiple 
                accept="image/*"
                style={{ display: 'none' }} 
                id="batch-upload"
                onChange={handleBatchFiles}
              />
              <label 
                htmlFor="batch-upload" 
                style={{ 
                  cursor: 'pointer', 
                  display: 'block',
                  padding: '2rem'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📸</div>
                <p style={{ fontWeight: 'bold', color: '#6B2D8B', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                  Haz clic para seleccionar múltiples imágenes
                </p>
                <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>
                  Soporta 100+ imágenes (JPG, PNG, WebP)
                </p>
                <p style={{ color: '#999', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                  O arrastra tus fotos aquí
                </p>
                {batchItems.length > 0 && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: '#f0fdf4', 
                    borderRadius: '0.5rem',
                    border: '2px solid #10B981'
                  }}>
                    <p style={{ color: '#16a34a', fontWeight: 'bold', margin: 0, fontSize: '1.125rem' }}>
                      ✅ {batchItems.length} archivo{batchItems.length !== 1 ? 's' : ''} seleccionado{batchItems.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </label>
            </div>

            {batchItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {batchItems.map((item, index) => (
                  <div key={index} style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', alignItems: 'start', border: item.uploading ? '2px solid #F59E0B' : item.uploaded ? '2px solid #10B981' : '1px solid #eee' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={item.preview} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                      {item.uploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>⏳</div>}
                      {item.uploaded && <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#10B981', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>}
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                      <input type="text" placeholder="Nombre del producto" value={item.name} onChange={(e) => updateBatchItem(index, 'name', e.target.value)} style={{ gridColumn: '1 / -1', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                      <input type="number" placeholder="Precio" value={item.price} onChange={(e) => updateBatchItem(index, 'price', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                      <input type="number" placeholder="Stock" value={item.stock} onChange={(e) => updateBatchItem(index, 'stock', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                      <select value={item.category} onChange={(e) => updateBatchItem(index, 'category', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', gridColumn: '1 / -1', background: 'white' }}>
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))
                        ) : (
                          <option value="General">General</option>
                        )}
                      </select>
                      <textarea placeholder="Descripción breve..." value={item.description} onChange={(e) => updateBatchItem(index, 'description', e.target.value)} rows={1} style={{ gridColumn: '1 / -1', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical' }} />
                    </div>
                    <button onClick={() => removeBatchItem(index)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                  </div>
                ))}
                <button 
                  onClick={handleBatchSubmit} 
                  disabled={batchLoading || batchItems.length === 0} 
                  style={{ 
                    background: '#6B2D8B', 
                    color: 'white', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    border: 'none', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem', 
                    cursor: batchLoading ? 'not-allowed' : 'pointer', 
                    opacity: batchLoading ? 0.7 : 1, 
                    marginTop: '1rem', 
                    boxShadow: '0 4px 6px rgba(107,45,139,0.3)' 
                  }}
                >
                  {batchLoading ? '⏳ Subiendo y guardando...' : `🚀 Guardar ${batchItems.length} Productos`}
                </button>
              </div>
            )}
          </div>
        )}

        {showCsvModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                <h3 style={{ margin: 0, color: '#6B2D8B' }}>📄 Importar Datos Masivos</h3>
                <button onClick={() => setShowCsvModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {csvData.length === 0 ? (
                  <>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>1. Descarga la plantilla y llénala con tus datos.</p>
                    <button onClick={downloadTemplate} style={{ background: '#f3f4f6', border: '1px solid #ddd', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', width: '100%', marginBottom: '1rem', fontWeight: 'bold' }}>⬇️ Descargar Plantilla CSV</button>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>2. Sube tu archivo CSV completado.</p>
                    <input type="file" accept=".csv" onChange={handleCsvUpload} disabled={csvLoading} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }} />
                  </>
                ) : (
                  <>
                    <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e40af' }}>
                        ✅ <strong>{csvData.length} productos listos.</strong> Selecciona las imágenes. El sistema las asignará si el nombre del archivo coincide con la columna "filename".
                      </p>
                    </div>
                    <input type="file" multiple accept="image/*" onChange={handleImageAssignment} style={{ marginBottom: '1rem', width: '100%' }} />
                    <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                          <tr>
                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Producto</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #eee' }}>Precio</th>
                            <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>Imagen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvData.map((p, idx) => (
                            <tr key={idx} style={{ background: assignedFiles[p.name] ? '#f0fdf4' : 'white' }}>
                              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{p.name}</td>
                              <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>${Number(p.price).toLocaleString()}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                                {assignedFiles[p.name] ? (
                                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ {assignedFiles[p.name].name}</span>
                                ) : (
                                  <span style={{ color: '#dc2626' }}>⚠️ Falta</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={handleSaveCsvBatch} disabled={csvLoading} style={{ marginTop: '1rem', width: '100%', background: '#6B2D8B', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: csvLoading ? 'not-allowed' : 'pointer' }}>
                      {csvLoading ? '⏳ Subiendo y Guardando...' : '💾 Guardar Todo'}
                    </button>
                  </>
                )}
                {csvMessage && (
                  <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: csvMessage.type === 'success' ? '#dcfce7' : '#fee2e2', color: csvMessage.type === 'success' ? '#166534' : '#991b1b' }}>
                    {csvMessage.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
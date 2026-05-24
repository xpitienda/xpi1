// app/admin/add-product/page.tsx
'use client';

import { useState, useRef } from 'react';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'La imagen no debe superar los 5MB' });
        return;
      }
      setPreview(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      // 1️⃣ Subir imagen a R2
      const imageFormData = new FormData();
      imageFormData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: imageFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.url) {
        throw new Error(uploadData.error || 'Error al subir imagen');
      }

      // 2️⃣ Guardar producto en Turso
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

      if (!productRes.ok) {
        throw new Error(productDataRes.error || 'Error al guardar producto');
      }

      // ✅ Éxito
      setMessage({ type: 'success', text: '✅ Producto guardado exitosamente' });
      
      // Resetear formulario
      form.reset();
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error(error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '❌ Error inesperado' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">➕ Agregar Nuevo Producto</h1>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow">
        
        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Imagen del producto <span className="text-red-500">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white hover:file:bg-gray-800"
            required
          />
          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">Máximo 5MB. Formatos: JPG, PNG, WebP</p>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Nombre del producto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Ej: Jeans Skinny Negro"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            name="description"
            placeholder="Detalles del producto, materiales, tallas, etc."
            rows={3}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Precio ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock inicial</label>
            <input
              type="number"
              name="stock"
              min="0"
              defaultValue="0"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Guardando...' : '💾 Guardar Producto'}
        </button>
      </form>
    </div>
  );
}
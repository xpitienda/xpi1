// app/vender/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VenderPage() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'General',
    archivo: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, archivo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    if (!formData.archivo) {
      setMensaje('❌ Debes seleccionar una imagen.');
      setLoading(false);
      return;
    }

    try {
      const fileData = new FormData();
      fileData.append('file', formData.archivo);

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fileData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error || 'Error subiendo imagen');

      const saveRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombre,
          description: formData.descripcion,
          price: Number(formData.precio),
          category: formData.categoria,
          image_url: uploadData.url,
          stock: 1,
          is_active: 1
        }),
      });

      if (!saveRes.ok) throw new Error('Error guardando producto');

      setMensaje('✅ ¡Producto publicado con éxito!');
      setFormData({ nombre: '', descripcion: '', precio: '', categoria: 'General', archivo: null });

    } catch (error: any) {
      setMensaje(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header con Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative w-12 h-12">
            <Image 
              src="/logo.png" 
              alt="XPI Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-xpi-purple">Vende</span> tu producto
          </h1>
        </div>
        
        <p className="text-gray-500 text-center mb-8">Sube fotos y detalles. ¡Es gratis!</p>

        {/* Mensajes */}
        {mensaje && (
          <div className={`p-4 rounded-lg mb-6 text-center font-medium ${
            mensaje.includes('✅') 
              ? 'bg-xpi-green/10 text-xpi-green-dark border border-xpi-green/30' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {mensaje}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl border-2 border-xpi-purple/20 space-y-5">
          
          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">📷 Foto del producto</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="block w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-xpi-purple/10 file:text-xpi-purple hover:file:bg-xpi-purple/20 cursor-pointer" 
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">📦 Nombre del producto</label>
            <input 
              type="text" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleInputChange} 
              required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xpi-purple focus:border-xpi-purple outline-none transition" 
              placeholder="Ej: Zapatillas deportivas" 
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">🏷️ Categoría</label>
            <select 
              name="categoria" 
              value={formData.categoria} 
              onChange={handleInputChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xpi-purple outline-none bg-white transition"
            >
              <option value="General">General</option>
              <option value="Ropa">👕 Ropa</option>
              <option value="Tecnología">💻 Tecnología</option>
              <option value="Hogar">🏠 Hogar</option>
              <option value="Deportes">⚽ Deportes</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">📝 Descripción</label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleInputChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xpi-purple outline-none transition" 
              placeholder="Detalles, estado, medidas, etc." 
              rows={4} 
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">💰 Precio ($)</label>
            <input 
              type="number" 
              name="precio" 
              value={formData.precio} 
              onChange={handleInputChange} 
              required 
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-xpi-purple outline-none transition" 
              placeholder="0.00" 
            />
          </div>

          {/* Botón de submit */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-xpi-purple text-white py-3.5 rounded-xl font-bold text-lg hover:bg-xpi-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> Subiendo...
              </>
            ) : (
              <>
                🚀 Publicar Producto
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
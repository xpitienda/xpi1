'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { Upload, Package, Tag, FileText, DollarSign, Rocket } from 'lucide-react';

export default function VenderPage() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'General',
    archivo: null as File | null,
  });

  const categories = [
    { value: 'General', label: 'General' },
    { value: 'Ropa', label: 'Ropa' },
    { value: 'Tecnologia', label: 'Tecnologia' },
    { value: 'Hogar', label: 'Hogar' },
    { value: 'Deportes', label: 'Deportes' },
    { value: 'Accesorios', label: 'Accesorios' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, archivo: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    if (!formData.archivo) {
      setMensaje('Debes seleccionar una imagen.');
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

      setMensaje('Producto publicado con exito!');
      setFormData({ nombre: '', descripcion: '', precio: '', categoria: 'General', archivo: null });
      setPreviewUrl(null);

    } catch (error: any) {
      setMensaje(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b4e] via-[#1a0a2e] to-[#2d1b4e]">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          <span className="text-white">Publicar </span>
          <span className="text-xpi-green">Producto</span>
        </h1>
        <p className="text-gray-400 text-center mb-8">Sube fotos y detalles de tu producto</p>

        {mensaje && (
          <div className={`p-4 rounded-lg mb-6 text-center font-medium ${
            mensaje.includes('exito') 
              ? 'bg-xpi-green/20 text-xpi-green border border-xpi-green/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1a0a2e]/80 p-6 rounded-2xl border border-[#6b3fa0]/30 shadow-[0_0_30px_rgba(107,63,160,0.2)] space-y-5">
          
          {/* Image Upload */}
          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-xpi-green" /> Foto del producto
            </label>
            <div className="relative">
              {previewUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-48 rounded-lg border-2 border-dashed border-[#6b3fa0]/50 flex items-center justify-center bg-[#2d1b4e]/30 mb-2">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-xpi-green/20 file:text-xpi-green hover:file:bg-xpi-green/30 cursor-pointer" 
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-xpi-green" /> Nombre del producto
            </label>
            <input 
              type="text" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleInputChange} 
              required 
              className="w-full px-4 py-3 bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 transition-colors" 
              placeholder="Ej: Zapatillas deportivas" 
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-xpi-green" /> Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, categoria: cat.value })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.categoria === cat.value
                      ? 'bg-xpi-green text-white'
                      : 'bg-[#2d1b4e]/50 text-gray-400 border border-[#6b3fa0]/30 hover:border-xpi-green/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-xpi-green" /> Descripcion
            </label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleInputChange} 
              className="w-full px-4 py-3 bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 transition-colors resize-none" 
              placeholder="Detalles, estado, medidas, etc." 
              rows={4} 
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-xpi-green" /> Precio (COP)
            </label>
            <input 
              type="number" 
              name="precio" 
              value={formData.precio} 
              onChange={handleInputChange} 
              required 
              min="0"
              className="w-full px-4 py-3 bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 transition-colors" 
              placeholder="0" 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-xpi-green to-xpi-cyan hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? (
              <span>Subiendo...</span>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Publicar Producto
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

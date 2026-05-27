// app/vender/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { Upload, Package, Tag, FileText, DollarSign, Loader2, CheckCircle, XCircle } from 'lucide-react';

const CATEGORIES = ['General', 'Ropa', 'Tecnologia', 'Hogar', 'Deportes', 'Accesorios'];

export default function VenderPage() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'General',
    archivo: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (cat: string) => {
    setFormData({ ...formData, categoria: cat });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, archivo: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    if (!formData.archivo) {
      setMensaje('error:Debes seleccionar una imagen.');
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

      setMensaje('success:Producto publicado con exito!');
      setFormData({ nombre: '', descripcion: '', precio: '', categoria: 'General', archivo: null });
      setPreview(null);

    } catch (error: any) {
      setMensaje(`error:${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isError = mensaje.startsWith('error:');
  const messageText = mensaje.replace(/^(error:|success:)/, '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b4e] via-[#1a0a2e] to-[#2d1b4e]">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          <span className="text-white">Vender </span>
          <span className="text-xpi-green">Producto</span>
        </h1>
        <p className="text-gray-400 text-center mb-8">Sube fotos y detalles de tu producto</p>

        {/* Message */}
        {mensaje && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            isError 
              ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
              : 'bg-xpi-green/20 border border-xpi-green/30 text-xpi-green'
          }`}>
            {isError ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {messageText}
          </div>
        )}

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-[#1a0a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#6b3fa0]/30 space-y-6"
          style={{ boxShadow: '0 0 40px rgba(107, 63, 160, 0.2)' }}
        >
          {/* Image Upload */}
          <div>
            <label className="text-white text-sm font-medium flex items-center gap-2 mb-3">
              <Upload className="w-4 h-4 text-xpi-green" />
              Foto del producto
            </label>
            <div className="relative">
              {preview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setFormData({ ...formData, archivo: null }); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-[#6b3fa0]/50 bg-[#2d1b4e]/30 cursor-pointer hover:bg-[#6b3fa0]/10 transition-colors">
                  <Upload className="w-10 h-10 text-gray-500 mb-2" />
                  <span className="text-gray-400 text-sm">Arrastra o haz clic para subir</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-white text-sm font-medium flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-xpi-green" />
              Nombre del producto
            </label>
            <input 
              type="text" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleInputChange} 
              required 
              className="w-full bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 focus:ring-1 focus:ring-xpi-green/30 transition-all" 
              placeholder="Ej: Zapatillas deportivas" 
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-white text-sm font-medium flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-xpi-green" />
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.categoria === cat
                      ? 'bg-xpi-green text-white'
                      : 'bg-[#2d1b4e]/50 text-gray-400 border border-[#6b3fa0]/30 hover:border-xpi-green/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-white text-sm font-medium flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-xpi-green" />
              Descripcion
            </label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleInputChange} 
              className="w-full bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 focus:ring-1 focus:ring-xpi-green/30 transition-all resize-none" 
              placeholder="Detalles, estado, medidas, etc." 
              rows={4} 
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-white text-sm font-medium flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-xpi-green" />
              Precio (COP)
            </label>
            <input 
              type="number" 
              name="precio" 
              value={formData.precio} 
              onChange={handleInputChange} 
              required 
              min="0"
              className="w-full bg-[#2d1b4e]/50 border border-[#6b3fa0]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-xpi-green/50 focus:ring-1 focus:ring-xpi-green/30 transition-all" 
              placeholder="0" 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-xpi-green/20 disabled:opacity-50"
            style={{ background: 'linear-gradient(to right, #00d4aa, #06b6d4)' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Publicar Producto
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { Upload, Package, Tag, FileText, DollarSign, Rocket, ImageIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          <span className="text-white">Publicar </span>
          <span className="text-[#00FF41]">Producto</span>
        </h1>
        <p className="text-gray-400 text-center mb-8">Sube fotos y detalles de tu producto</p>

        {mensaje && (
          <div className={`max-w-2xl mx-auto p-4 rounded-xl mb-6 text-center font-medium ${
            mensaje.includes('exito') 
              ? 'bg-[#00FF41]/10 text-[#00FF41] border-2 border-[#00FF41]/30' 
              : 'bg-red-500/10 text-red-400 border-2 border-red-500/30'
          }`}>
            {mensaje}
          </div>
        )}

        {/* Layout de dos columnas */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Columna Izquierda - Preview de Imagen */}
          <div className="bg-gradient-to-br from-[#00FF41]/10 to-[#BF00FF]/10 p-6 rounded-2xl border-2 border-[#00FF41]/40 shadow-lg shadow-[#00FF41]/10">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#00FF41]" />
              Vista Previa
            </h2>
            
            {/* Recuadro de Imagen Grande */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#1a0a2e]/80 border-2 border-[#BF00FF]/30 mb-4">
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mb-3 text-[#BF00FF]/40" />
                  <span className="text-sm">La imagen aparecera aqui</span>
                </div>
              )}
            </div>
            
            {/* Input de archivo */}
            <label className="block">
              <div className="flex items-center justify-center w-full py-3 px-4 bg-[#00FF41] hover:bg-[#00CC33] text-black font-bold rounded-xl cursor-pointer transition-all transform hover:scale-[1.02]">
                <Upload className="w-5 h-5 mr-2" />
                {previewUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
            
            {previewUrl && formData.nombre && (
              <div className="mt-4 p-3 bg-[#1a0a2e]/60 rounded-xl border border-[#00FF41]/20">
                <p className="text-white font-medium truncate">{formData.nombre}</p>
                {formData.precio && (
                  <p className="text-[#00FF41] font-bold text-xl mt-1">
                    ${Number(formData.precio).toLocaleString('es-CO')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Columna Derecha - Formulario */}
          <form onSubmit={handleSubmit} className="bg-[#2d1b4e]/80 p-6 rounded-2xl border-2 border-[#BF00FF]/30 shadow-lg shadow-[#BF00FF]/10 space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#00FF41]" /> Nombre del producto
              </label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-3 bg-[#1a0a2e]/50 border-2 border-[#BF00FF]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-colors" 
                placeholder="Ej: Zapatillas deportivas" 
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#00FF41]" /> Categoria
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, categoria: cat.value })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      formData.categoria === cat.value
                        ? 'bg-[#00FF41] text-black'
                        : 'bg-[#1a0a2e]/50 text-gray-300 border border-[#BF00FF]/30 hover:border-[#00FF41]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00FF41]" /> Descripcion
              </label>
              <textarea 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleInputChange} 
                className="w-full px-4 py-3 bg-[#1a0a2e]/50 border-2 border-[#BF00FF]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-colors resize-none" 
                placeholder="Detalles, estado, medidas, etc." 
                rows={3} 
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#00FF41]" /> Precio (COP)
              </label>
              <input 
                type="number" 
                name="precio" 
                value={formData.precio} 
                onChange={handleInputChange} 
                required 
                min="0"
                className="w-full px-4 py-3 bg-[#1a0a2e]/50 border-2 border-[#BF00FF]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] transition-colors" 
                placeholder="0" 
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 bg-gradient-to-r from-[#00FF41] to-[#00CC33] hover:from-[#00CC33] hover:to-[#00FF41] disabled:opacity-50 transition-all transform hover:scale-[1.02] shadow-lg shadow-[#00FF41]/30"
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
    </div>
  );
}

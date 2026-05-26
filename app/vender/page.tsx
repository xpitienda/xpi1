'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Upload, Package, Tag, FileText, DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'General', label: 'General', icon: '📦' },
  { value: 'Ropa', label: 'Ropa', icon: '👕' },
  { value: 'Tecnología', label: 'Tecnología', icon: '💻' },
  { value: 'Hogar', label: 'Hogar', icon: '🏠' },
  { value: 'Deportes', label: 'Deportes', icon: '⚽' },
];

export default function VenderPage() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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
      const file = e.target.files[0];
      setFormData({ ...formData, archivo: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    if (!formData.archivo) {
      setMensaje({ type: 'error', text: 'Debes seleccionar una imagen.' });
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

      setMensaje({ type: 'success', text: 'Producto publicado con éxito!' });
      setFormData({ nombre: '', descripcion: '', precio: '', categoria: 'General', archivo: null });
      setImagePreview(null);

    } catch (error: any) {
      setMensaje({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Link */}
        <Link 
          href="/catalog" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-xpi-purple mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-xpi-purple/10 rounded-full mb-4">
            <Tag className="w-8 h-8 text-xpi-purple" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vende tu producto
          </h1>
          <p className="text-gray-500">
            Publica gratis y llega a miles de compradores
          </p>
        </div>

        {/* Message Alert */}
        {mensaje && (
          <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
            mensaje.type === 'success' 
              ? 'bg-xpi-green/10 text-xpi-green-dark border border-xpi-green/30' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {mensaje.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-medium">{mensaje.text}</p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Image Upload Section */}
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Upload className="w-4 h-4 inline-block mr-2" />
              Foto del producto
            </label>
            
            <div className="relative">
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, archivo: null });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-xpi-purple hover:bg-xpi-purple/5 transition-all">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Haz clic o arrastra una imagen</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG hasta 10MB</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-5">
            
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Package className="w-4 h-4" />
                Nombre del producto
              </label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-xpi-purple/20 focus:border-xpi-purple outline-none transition-all" 
                placeholder="Ej: Zapatillas deportivas Nike" 
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-4 h-4" />
                Categoría
              </label>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, categoria: cat.value })}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      formData.categoria === cat.value
                        ? 'border-xpi-purple bg-xpi-purple/10 text-xpi-purple'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl block mb-1">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Descripción
              </label>
              <textarea 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleInputChange} 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-xpi-purple/20 focus:border-xpi-purple outline-none transition-all resize-none" 
                placeholder="Describe el estado, características, medidas, etc." 
                rows={4} 
              />
            </div>

            {/* Price */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Precio (COP)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                <input 
                  type="number" 
                  name="precio" 
                  value={formData.precio} 
                  onChange={handleInputChange} 
                  required 
                  min="0"
                  step="100"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-xpi-purple/20 focus:border-xpi-purple outline-none transition-all" 
                  placeholder="0" 
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-xpi-purple text-white py-4 rounded-xl font-bold text-lg hover:bg-xpi-purple-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Publicar Producto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

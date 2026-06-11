'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, CheckCircle, AlertCircle, DollarSign, Package, Tag, Image as ImageIcon, User, Phone } from 'lucide-react';
import Header from '@/components/Header';

export default function VenderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'General',
    stock: '1',
    image_url: '',
    seller_name: '',
    seller_phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      setError('Por favor sube solo archivos de imagen');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir a Cloudflare R2
    setUploadingImage(true);
    setError('');
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      
      const res = await fetch('/api/admin/upload', { 
        method: 'POST', 
        body: formDataUpload 
      });
      
      const data = await res.json();
      
      if (data.success && data.url) {
        setFormData({ ...formData, image_url: data.url });
        // setError(''); // Limpiar error si existe
      } else {
        setError('Error al subir la imagen: ' + (data.error || 'Error desconocido'));
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Error de conexión al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Limpiar formulario
        setFormData({
          name: '', description: '', price: '', category: 'General', 
          stock: '1', image_url: '', seller_name: '', seller_phone: ''
        });
        setImagePreview('');
      } else {
        setError(data.error || 'Error al publicar');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: 'rgba(45,27,78,0.9)', borderRadius: '2rem', padding: '3rem', textAlign: 'center', border: '3px solid #00FF41', boxShadow: '0 0 50px rgba(0,255,65,0.3)', maxWidth: '500px', width: '100%' }}>
          <CheckCircle style={{ width: '5rem', height: '5rem', color: '#00FF41', margin: '0 auto 1.5rem' }} />
          <h2 style={{ color: '#00FF41', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>¡Producto Publicado!</h2>
          <p style={{ color: '#e9d5ff', marginBottom: '2rem', fontSize: '1.1rem' }}>Tu producto ya está disponible en el catálogo.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => router.push('/catalog')} 
              style={{ background: 'linear-gradient(135deg, #2E7D32, #16a34a)', color: 'white', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 'bold', border: '2px solid #00FF41', cursor: 'pointer' }}
            >
              Ver Catálogo
            </button>
            <button 
              onClick={() => setSuccess(false)} 
              style={{ background: 'transparent', color: '#e9d5ff', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 'bold', border: '2px solid #9333EA', cursor: 'pointer' }}
            >
              Publicar Otro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Efectos de fondo */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: '#6B21A8', filter: 'blur(150px)', opacity: '0.3', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: '#2E7D32', filter: 'blur(150px)', opacity: '0.2', borderRadius: '50%' }}></div>

      <Header />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '50rem', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(to right, #00FF41, #00BFFF, #E879F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            Publica tu Producto
          </h1>
          <p style={{ color: '#a78bfa', fontSize: '1.2rem' }}>Llega a miles de clientes en Xpi Tienda</p>
        </div>

        {/* Formulario Container */}
        <div style={{ background: 'rgba(26, 11, 46, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '2rem', border: '2px solid #2E7D32', padding: '2.5rem', boxShadow: '0 0 40px rgba(46, 125, 50, 0.2)' }}>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Campo Nombre */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: '#00FF41', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package style={{ width: '1.25rem' }} /> Nombre del Producto
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Jean Slim Fit Azul"
                style={{ width: '100%', padding: '1rem', background: 'rgba(45,27,78,0.5)', border: '2px solid #6B21A8', borderRadius: '1rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#00FF41'}
                onBlur={(e) => e.target.style.borderColor = '#6B21A8'}
              />
            </div>

            {/* Campo Precio */}
            <div>
              <label style={{ display: 'block', color: '#00FF41', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign style={{ width: '1.25rem' }} /> Precio
              </label>
              <input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="$ 0.00"
                style={{ width: '100%', padding: '1rem', background: 'rgba(45,27,78,0.5)', border: '2px solid #6B21A8', borderRadius: '1rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#00FF41'}
                onBlur={(e) => e.target.style.borderColor = '#6B21A8'}
              />
            </div>

            {/* Campo Stock */}
            <div>
              <label style={{ display: 'block', color: '#00FF41', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag style={{ width: '1.25rem' }} /> Stock Disponible
              </label>
              <input
                required
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="1"
                style={{ width: '100%', padding: '1rem', background: 'rgba(45,27,78,0.5)', border: '2px solid #6B21A8', borderRadius: '1rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#00FF41'}
                onBlur={(e) => e.target.style.borderColor = '#6B21A8'}
              />
            </div>

            {/* Categoría */}
            <div>
              <label style={{ display: 'block', color: '#00FF41', fontWeight: 'bold', marginBottom: '0.5rem' }}>Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '1rem', background: '#2d1b4e', border: '2px solid #6B21A8', borderRadius: '1rem', color: 'white', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="General">General</option>
                <option value="Ropa">Ropa</option>
                <option value="Tecnologia">Tecnología</option>
                <option value="Hogar">Hogar</option>
                <option value="Deportes">Deportes</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            {/* URL Imagen o Upload */}
            <div>
              <label style={{ display: 'block', color: '#00FF41', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon style={{ width: '1.25rem' }} /> Imagen del Producto
              </label>
              
              {/* Preview de imagen */}
              {imagePreview && (
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      borderRadius: '0.5rem', 
                      border: '2px solid #00FF41',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                  />
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Upload de archivo */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#a78bfa', marginBottom: '0.5rem' }}>
                    Subir desde tu PC:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(45,27,78,0.5)',
                      border: '2px solid #6B21A8',
                      borderRadius: '1rem',
                      color: 'white',
                      fontSize: '0.875rem',
                      cursor: uploadingImage ? 'not-allowed' : 'pointer'
                    }}
                  />
                  {uploadingImage && (
                    <div style={{ color: '#00FF41', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      ⏳ Subiendo imagen...
                    </div>
                  )}
                </div>
                
                {/* Separador */}
                <div style={{ textAlign: 'center', color: '#6B21A8', fontSize: '0.875rem' }}>ó</div>
                
                {/* URL directa */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: '#a78bfa', marginBottom: '0.5rem' }}>
                    URL de la imagen:
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/foto.jpg"
                    style={{ width: '100%', padding: '1rem', background: 'rgba(45,27,78,0.5)', border: '2px solid #6B21A8', borderRadius: '1rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#00FF41'}
                    onBlur={(e) => e.target.style.borderColor = '#6B21A8'}
                  />
                </div>
              </div>
            </div>

            {/* Descripción (Full width) */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: '#00FF41', fontWeight: 'bold', marginBottom: '0.5rem' }}>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe tu producto..."
                style={{ width: '100%', padding: '1rem', background: 'rgba(45,27,78,0.5)', border: '2px solid #6B21A8', borderRadius: '1rem', color: 'white', fontSize: '1rem', outline: 'none', resize: 'vertical', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#00FF41'}
                onBlur={(e) => e.target.style.borderColor = '#6B21A8'}
              />
            </div>

            {/* Separador para datos del vendedor */}
            <div style={{ gridColumn: 'span 2', borderTop: '2px dashed #6B21A8', margin: '1rem 0', paddingTop: '1rem' }}>
              <h3 style={{ color: '#E879F9', textAlign: 'center', marginBottom: '1rem' }}>Tus Datos de Contacto</h3>
            </div>

            {/* Vendedor Nombre */}
            <div>
              <label style={{ display: 'block', color: '#a78bfa', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User style={{ width: '1.25rem' }} /> Tu Nombre
              </label>
              <input
                required
                name="seller_name"
                value={formData.seller_name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                style={{ width: '100%', padding: '1rem', background: 'rgba(45,27,78,0.5)', border: '2px solid #6B21A8', borderRadius: '1rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#00FF41'}
                onBlur={(e) => e.target.style.borderColor = '#6B21A8'}
              />
            </div>

            {/* Vendedor Teléfono */}
            <div>
              <label style={{ display: 'block', color: '#a78bfa', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone style={{ width: '1.25rem' }} /> Tu WhatsApp
              </label>
              <input
                required
                name="seller_phone"
                value={formData.seller_phone}
                onChange={handleChange}
                placeholder="300 123 4567"
                style={{ width: '100%', padding: '1rem', background: 'rgba(45,27,78,0.5)', border: '2px solid #6B21A8', borderRadius: '1rem', color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#00FF41'}
                onBlur={(e) => e.target.style.borderColor = '#6B21A8'}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ gridColumn: 'span 2', background: 'rgba(220,38,38,0.2)', border: '2px solid #dc2626', color: '#fca5a5', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle style={{ width: '1.5rem' }} /> {error}
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading || uploadingImage}
              style={{
                gridColumn: 'span 2',
                marginTop: '1rem',
                background: loading || uploadingImage ? '#6B21A8' : 'linear-gradient(135deg, #00FF41 0%, #2E7D32 100%)',
                color: loading || uploadingImage ? '#a78bfa' : '#1a0b2e',
                padding: '1.25rem',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                border: '2px solid #00FF41',
                cursor: loading || uploadingImage ? 'not-allowed' : 'pointer',
                boxShadow: loading || uploadingImage ? 'none' : '0 0 20px rgba(0,255,65,0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>Publicando...</>
              ) : uploadingImage ? (
                <>Subiendo imagen...</>
              ) : (
                <>
                  <Upload style={{ width: '1.5rem', height: '1.5rem' }} />
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
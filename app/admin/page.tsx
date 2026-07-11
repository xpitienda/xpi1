'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  stock: number;
  is_active: number;
  on_sale?: number;
  sale_price?: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'General',
    stock: '',
    image_url: '',
    is_active: 1,
  });
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const data = await res.json();
      const activeProducts = data.filter((p: Product) => p.is_active === 1);
      setProducts(activeProducts);
      console.log('Productos activos cargados:', activeProducts.length);
    } catch (err: any) {
      console.error('Error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchProducts();
      fetchCategories();
  }, []);


  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
      });
      const data = await res.json();
      setCategories(data.map((c: any) => c.name));
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Eliminar "${name}" permanentemente?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}` }
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert('Producto eliminado');
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (err: any) {
      alert('Error de conexion: ' + err.message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || 'General',
      stock: product.stock.toString(),
      image_url: product.image_url || '',
      is_active: product.is_active,
    });
    setImagePreview(product.image_url || '');
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'General',
      stock: '',
      image_url: '',
      is_active: 1,
    });
    setImagePreview('');
    setImageError({});
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
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
        alert('Imagen subida correctamente');
      } else {
        alert('Error al subir: ' + (data.error || 'Error desconocido'));
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Error de conexion: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('El precio debe ser un numero mayor a 0');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert('El stock debe ser un numero valido');
      return;
    }

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';

      const method = editingProduct ? 'PUT' : 'POST';

      const bodyData = {
        name: String(formData.name).trim(),
        description: String(formData.description || '').trim(),
        price: Number(priceNum),
        category: String(formData.category || 'General'),
        stock: Number(stockNum),
        image_url: String(formData.image_url || ''),
        is_active: Number(formData.is_active || 0),
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`
        },
        body: JSON.stringify(bodyData),
      });

      const responseData = await res.json();

      if (res.ok) {
        if (editingProduct) {
          setProducts(products.map(p =>
            p.id === editingProduct.id
              ? { ...p, ...bodyData }
              : p
          ));
          alert('Producto actualizado');
        } else {
          const newProduct: Product = {
            id: Date.now().toString(),
            ...bodyData,
          };
          setProducts([...products, newProduct]);
          alert('Producto creado');
        }

        setShowModal(false);
        setImagePreview('');
      } else {
        alert('Error: ' + (responseData.error || 'Error al guardar'));
      }
    } catch (err: any) {
      console.error('Error detallado:', err);
      alert('Error de conexion: ' + err.message);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_pass=; path=/; max-age=0';
    router.push('/');
  };

  const handleImageError = (productId: string) => {
    setImageError(prev => ({ ...prev, [productId]: true }));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Cargando productos...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #faf5ff, #f0fdf4)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Panel de Control</h1>
            
            {/* 👇 AQUÍ ESTÁ EL CAMBIO: Se agregaron dos botones nuevos junto a Categorías */}
            <div style={{ marginLeft: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => router.push('/admin/categories')} style={{ background: 'linear-gradient(135deg, #9333ea, #16a34a)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #16a34a', cursor: 'pointer' }}> Categorías</button>
              
              {/* NUEVO BOTÓN: Gestión de Factureros */}
              <button onClick={() => router.push('/admin/invoices')} style={{ background: 'linear-gradient(135deg, #4B0082, #2E7D32)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #2E7D32', cursor: 'pointer' }}>🧾 Factureros</button>
            </div>
            {/* 👆 FIN DEL CAMBIO */}

          <button
            onClick={handleLogout}
            style={{ background: '#4b5563', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            Cerrar Sesion
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Productos</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7e22ce' }}>{products.length}</div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Activos</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d' }}>
              {products.filter(p => p.is_active).length}
            </div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sin Stock</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
              {products.filter(p => p.stock === 0).length}
            </div>
          </div>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Valor Inventario</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1d4ed8' }}>
              ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Gestion de Productos</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => router.push('/admin/featured')}
              style={{ background: '#fbbf24', color: '#1f2937', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              Destacados y Ofertas
            </button>
            <button
              onClick={() => router.push('/admin/add-product')}
              style={{ background: '#8B5CF6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              Carga Masiva
            </button>
            <button
              onClick={() => router.push('/admin/generate-csv')}
              style={{ background: '#EC4899', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
               Generar CSV desde Fotos
            </button>
            <button
              onClick={handleAddNew}
              style={{ background: '#16a34a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              Agregar Producto
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          {products.map((product) => {
            const hasImageError = imageError[product.id];
            const showPlaceholder = !product.image_url || hasImageError;

            return (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '2px solid #16a34a',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  height: '192px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: showPlaceholder ? '#e5e7eb' : '#f3f4f6'
                }}>
                  {showPlaceholder ? (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#e5e7eb',
                      color: '#9ca3af',
                      fontSize: '3rem'
                    }}>
                      Sin imagen
                    </div>
                  ) : (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={() => handleImageError(product.id)}
                    />
                  )}

                  {!product.is_active && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      INACTIVO
                    </div>
                  )}
                </div>

                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '1.1rem' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      {product.category}
                    </p>
                    <p style={{ color: '#15803d', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                      ${product.price.toLocaleString()}
                    </p>
                    <p style={{
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      marginBottom: '0.75rem',
                      color: product.stock === 0 ? '#dc2626' : '#16a34a'
                    }}>
                      Stock: {product.stock}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        flex: 1,
                        background: '#9333ea',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      style={{
                        flex: 1,
                        background: '#dc2626',
                        color: 'white',
                        padding: '0.6rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>Sin productos</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>No hay productos</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Agrega tu primer producto!</p>
            <button
              onClick={handleAddNew}
              style={{ background: '#16a34a', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              Agregar Producto
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
            overflowY: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setImagePreview('');
            }
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            maxWidth: '42rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '2px solid #e9d5ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 10,
              borderRadius: '1rem 1rem 0 0'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7e22ce' }}>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setImagePreview('');
                }}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                X
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #16a34a',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Ej: Camiseta Deportiva"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                    Descripcion
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #16a34a',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    rows={3}
                    placeholder="Describe el producto..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                      Precio *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #16a34a',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                      Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #16a34a',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #16a34a',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                    Imagen del Producto
                  </label>

                  {imagePreview && (
                    <div style={{ marginBottom: '1rem' }}>
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        style={{
                          width: '10rem',
                          height: '10rem',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          border: '4px solid #16a34a',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }}
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#4b5563', marginBottom: '0.5rem' }}>
                        Subir imagen:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #16a34a',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          boxSizing: 'border-box'
                        }}
                      />
                      {uploading && (
                        <div style={{ color: '#9333ea', marginTop: '0.5rem', fontWeight: 'bold' }}>
                          Subiendo imagen...
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#4b5563', marginBottom: '0.5rem' }}>
                        O URL directa:
                      </label>
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={formData.image_url}
                        onChange={(e) => {
                          setFormData({...formData, image_url: e.target.value});
                          setImagePreview(e.target.value);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #16a34a',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})}
                      style={{ width: '1.5rem', height: '1.5rem' }}
                    />
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '1.125rem' }}>Producto Activo</span>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Desmarca para ocultar del catalogo</p>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(to right, #9333ea, #16a34a)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    opacity: uploading ? 0.5 : 1
                  }}
                >
                  {editingProduct ? 'Actualizar' : 'Crear Producto'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setImagePreview('');
                  }}
                  style={{
                    flex: 1,
                    background: '#9ca3af',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
  });
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { 'Authorization': Bearer  }
      });
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      console.error('Error:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(Eliminar categoría ""?)) return;
    try {
      const res = await fetch(/api/admin/categories?id=, {
        method: 'DELETE',
        headers: { 'Authorization': Bearer  }
      });

      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
        alert('Categoría eliminada');
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (err: any) {
      alert('Error de conexión: ' + err.message);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parent_id: category.parent_id || '',
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', parent_id: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      const url = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const bodyData = {
        ...(editingCategory && { id: editingCategory.id }),
        name: formData.name.trim(),
        parent_id: formData.parent_id || null,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer 
        },
        body: JSON.stringify(bodyData),
      });

      const responseData = await res.json();

      if (res.ok) {
        if (editingCategory) {
          setCategories(categories.map(c =>
            c.id === editingCategory.id
              ? { ...c, ...bodyData }
              : c
          ));
          alert('Categoría actualizada');
        } else {
          const newCategory: Category = {
            id: responseData.id,
            ...bodyData,
          };
          setCategories([...categories, newCategory]);
          alert('Categoría creada');
        }

        setShowModal(false);
        fetchCategories(); // Recargar para actualizar la lista
      } else {
        alert('Error: ' + (responseData.error || 'Error al guardar'));
      }
    } catch (err: any) {
      console.error('Error detallado:', err);
      alert('Error de conexión: ' + err.message);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_pass=; path=/; max-age=0';
    router.push('/');
  };

  // Organizar categorías en jerarquía
  const parentCategories = categories.filter(c => !c.parent_id);
  const getSubcategories = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #faf5ff, #f0fdf4)', padding: '1.5rem' }}>
      <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <div>
            <button
              onClick={() => router.push('/admin')}
              style={{ background: '#6b7280', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '0.5rem' }}
            >
              ← Volver al Panel
            </button>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>Gestión de Categorías</h1>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: '#4b5563', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Total: {categories.length} categorías
          </h2>
          <button
            onClick={handleAddNew}
            style={{ background: '#16a34a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          >
            + Nueva Categoría
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {parentCategories.map((category) => {
            const subcategories = getSubcategories(category.id);

            return (
              <div key={category.id} style={{ background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', background: '#f9fafb', borderBottom: '2px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#7e22ce', margin: 0 }}>
                      {category.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                      Categoría principal
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(category)}
                      style={{ background: '#9333ea', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {subcategories.length > 0 && (
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280', marginBottom: '0.75rem' }}>
                      Subcategorías ({subcategories.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {subcategories.map((subcat) => (
                        <div key={subcat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                          <span style={{ color: '#374151' }}>{subcat.name}</span>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEdit(subcat)}
                              style={{ background: '#9333ea', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(subcat.id, subcat.name)}
                              style={{ background: '#dc2626', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>No hay categorías</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Crea tu primera categoría para organizar productos</p>
            <button
              onClick={handleAddNew}
              style={{ background: '#16a34a', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
            >
              + Nueva Categoría
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            maxWidth: '32rem',
            width: '100%',
            position: 'relative'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '2px solid #e9d5ff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7e22ce' }}>
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
                ×
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
                    placeholder="Ej: Ropa Deportiva"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                    Categoría Padre (opcional)
                  </label>
                  <select
                    value={formData.parent_id}
                    onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
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
                    <option value="">Ninguna (será categoría principal)</option>
                    {categories
                      .filter(c => !editingCategory || c.id !== editingCategory.id)
                      .filter(c => !c.parent_id)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Selecciona una categoría principal para crear una subcategoría
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <button
                  type="submit"
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
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                >
                  {editingCategory ? 'Actualizar' : 'Crear Categoría'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

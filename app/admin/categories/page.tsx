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
  
  // Nuevo estado para subcategorías masivas
  const [subcategoriesInput, setSubcategoriesInput] = useState('');
  
  const [formData, setFormData] = useState({ name: '', parent_id: '' });
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
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

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm('Eliminar categoría "' + name + '"?')) return;
    try {
      const res = await fetch('/api/admin/categories?id=' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD }
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
    setFormData({ name: category.name, parent_id: category.parent_id || '' });
    setSubcategoriesInput(''); // Limpiar input de subcategorías al editar
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', parent_id: '' });
    setSubcategoriesInput('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { alert('El nombre es obligatorio'); return; }
    
    try {
      // 1. Crear/Actualizar la categoría principal
      const url = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const bodyData = {
        ...(editingCategory && { id: editingCategory.id }),
        name: formData.name.trim(),
        parent_id: formData.parent_id || null,
      };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD },
        body: JSON.stringify(bodyData),
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        alert('Error: ' + (responseData.error || 'Error al guardar categoría principal'));
        return;
      }

      // Obtener el ID de la categoría recién creada o editada
      const mainCategoryId = editingCategory ? editingCategory.id : responseData.id;

      // Solo permitimos añadir subcategorías a categorías principales (sin padre)
      const canAddSubcategories = !formData.parent_id;

      // 2. Procesar subcategorías masivas si existen
      let createdSubs = 0;
      if (subcategoriesInput.trim() && canAddSubcategories) {
        const subNames = subcategoriesInput
          .split(/[\n,]/) // Separar por saltos de línea o comas
          .map(s => s.trim())
          .filter(s => s.length > 0);

        for (const subName of subNames) {
          const subRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_ADMIN_PASSWORD },
            body: JSON.stringify({
              name: subName,
              parent_id: mainCategoryId
            }),
          });
          if (subRes.ok) createdSubs++;
        }
      }

      if (editingCategory) {
        alert(createdSubs > 0 ? 'Categoría actualizada y ' + createdSubs + ' subcategoría(s) añadida(s)' : 'Categoría actualizada');
      } else if (createdSubs > 0) {
        alert('Categoría principal y ' + createdSubs + ' subcategoría(s) creadas exitosamente');
      } else {
        alert('Categoría creada');
      }

      setShowModal(false);
      fetchCategories();
      
    } catch (err: any) {
      alert('Error de conexión: ' + err.message);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_pass=; path=/; max-age=0';
    router.push('/');
  };

  const parentCategories = categories.filter(c => !c.parent_id);
  const getSubcategories = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #3D1A78 0%, #006B3C 100%)' }}><div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>Cargando categorías...</div></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #3D1A78 0%, #2A1155 50%, #006B3C 100%)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 107, 60, 0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '60rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.95)', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 20px 40px -10px rgba(61, 26, 120, 0.4), 0 0 0 2px #006B3C', backdropFilter: 'blur(10px)' }}>
          <div>
            <button onClick={() => router.push('/admin')} style={{ background: '#3D1A78', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #006B3C', cursor: 'pointer', marginBottom: '0.5rem', transition: 'all 0.3s ease' }}>← Volver al Panel</button>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#3D1A78' }}>Gestión de Categorías</h1>
          </div>
          <button onClick={handleLogout} style={{ background: '#006B3C', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #3D1A78', cursor: 'pointer', transition: 'all 0.3s ease' }}>Cerrar Sesión</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Total: {categories.length} categorías</h2>
          <button onClick={handleAddNew} style={{ background: 'linear-gradient(135deg, #006B3C 0%, #008B4C 100%)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #9333ea', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(0, 107, 60, 0.5)', transition: 'all 0.3s ease' }}>+ Nueva Categoría</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {parentCategories.map((category) => {
            const subcategories = getSubcategories(category.id);
            return (
              <div key={category.id} style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(61, 26, 120, 0.3), 0 0 0 2px #006B3C', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
                <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #3D1A78 0%, #5B2D9E 100%)', borderBottom: '3px solid #006B3C', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{category.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#d8b4fe', margin: '0.25rem 0 0 0' }}>Categoría principal</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(category)} style={{ background: '#9333ea', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #006B3C', cursor: 'pointer', transition: 'all 0.3s ease' }}>Editar</button>
                    <button onClick={() => handleDelete(category.id, category.name)} style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #006B3C', cursor: 'pointer', transition: 'all 0.3s ease' }}>Eliminar</button>
                  </div>
                </div>
                {subcategories.length > 0 && (
                  <div style={{ padding: '1rem', background: 'rgba(249, 250, 251, 0.9)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#3D1A78', marginBottom: '0.75rem', borderBottom: '2px solid #006B3C', paddingBottom: '0.5rem' }}>Subcategorías ({subcategories.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {subcategories.map((subcat) => (
                        <div key={subcat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #006B3C', transition: 'all 0.3s ease' }}>
                          <span style={{ color: '#3D1A78', fontWeight: '500' }}>{subcat.name}</span>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEdit(subcat)} style={{ background: '#9333ea', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 'bold', border: '1px solid #006B3C', cursor: 'pointer' }}>Editar</button>
                            <button onClick={() => handleDelete(subcat.id, subcat.name)} style={{ background: '#dc2626', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 'bold', border: '1px solid #006B3C', cursor: 'pointer' }}>Eliminar</button>
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
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '3rem', textAlign: 'center', borderRadius: '1rem', boxShadow: '0 20px 40px -10px rgba(61, 26, 120, 0.4), 0 0 0 2px #006B3C', marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D1A78', marginBottom: '0.5rem' }}>No hay categorías</h3>
            <p style={{ color: '#006B3C', marginBottom: '1.5rem' }}>Crea tu primera categoría para organizar productos</p>
            <button onClick={handleAddNew} style={{ background: 'linear-gradient(135deg, #006B3C 0%, #008B4C 100%)', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 'bold', border: '2px solid #9333ea', cursor: 'pointer' }}>+ Nueva Categoría</button>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(61, 26, 120, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 9999, backdropFilter: 'blur(5px)' }} onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); } }}>
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(61, 26, 120, 0.5), 0 0 0 3px #006B3C', maxWidth: '32rem', width: '100%', position: 'relative' }}>
            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #3D1A78 0%, #5B2D9E 100%)', borderBottom: '3px solid #006B3C', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '1rem 1rem 0 0' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid #006B3C', width: '2.5rem', height: '2.5rem', borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#3D1A78', marginBottom: '0.5rem' }}>Nombre *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '2px solid #006B3C', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }} placeholder="Ej: Calzado" required />
                </div>
                
                {/* CAMPO PARA SUBCATEGORÍAS MASIVAS (solo en categorías principales) */}
                {!formData.parent_id && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#3D1A78', marginBottom: '0.5rem' }}>{editingCategory ? 'Añadir subcategorías (Opcional)' : 'Subcategorías (Opcional)'}</label>
                    <textarea 
                      value={subcategoriesInput} 
                      onChange={(e) => setSubcategoriesInput(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', border: '2px solid #006B3C', borderRadius: '0.5rem', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }} 
                      placeholder="Escribe cada subcategoría en una nueva línea o sepáralas por comas&#10;Ej: Tennis, Zapatillas, Zapatos Dama" 
                    />
                    <p style={{ fontSize: '0.75rem', color: '#006B3C', marginTop: '0.25rem' }}>Estas se crearán automáticamente como hijas de "{formData.name || 'la categoría'}"</p>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', color: '#3D1A78', marginBottom: '0.5rem' }}>Categoría Padre (opcional)</label>
                  <select value={formData.parent_id} onChange={(e) => setFormData({...formData, parent_id: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '2px solid #006B3C', borderRadius: '0.5rem', fontSize: '1rem', background: 'white', boxSizing: 'border-box', outline: 'none' }}>
                    <option value="">Ninguna (será categoría principal)</option>
                    {categories.filter(c => !editingCategory || c.id !== editingCategory.id).filter(c => !c.parent_id).map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#006B3C', marginTop: '0.25rem' }}>Si seleccionas una, esta será una subcategoría individual</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #006B3C' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #3D1A78 0%, #5B2D9E 100%)', color: 'white', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1.125rem', border: '2px solid #006B3C', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(61, 26, 120, 0.4)' }}>{editingCategory ? 'Actualizar' : 'Crear Categoría'}</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#6b7280', color: 'white', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1.125rem', border: '2px solid #006B3C', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

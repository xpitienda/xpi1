'use client';

import { useState, useEffect } from 'react';
import { Upload, Download, FileSpreadsheet, Save, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GenerateCSVPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkDescription, setBulkDescription] = useState('Producto de alta calidad. Consulte disponibilidad.');
  const [bulkPrice, setBulkPrice] = useState(0);
  const [bulkStock, setBulkStock] = useState(1);

  // Cargar categorías desde la base de datos
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          // Extraer solo los nombres de las categorías
          const categoryNames = data.map((cat: any) => cat.name);
          setCategories(categoryNames);
          // Establecer la primera categoría como valor por defecto
          if (categoryNames.length > 0) {
            setBulkCategory(categoryNames[0]);
          }
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };
    
    loadCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadSingleImage = async (file: File): Promise<{ name: string; url: string } | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir');
      const data = await response.json();
      
      if (data.success) {
        return { name: file.name, url: data.url };
      }
      return null;
    } catch (error) {
      console.error('Error subiendo ' + file.name + ':', error);
      return null;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setProgress('Preparando ' + files.length + ' imágenes...');
    setCsvData([]);

    try {
      const results: { name: string; url: string }[] = [];
      const batchSize = 5;
      const totalBatches = Math.ceil(files.length / batchSize);

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const currentBatch = Math.floor(i / batchSize) + 1;
        
        setProgress('Subiendo lote ' + currentBatch + ' de ' + totalBatches + '...');

        const batchPromises = batch.map(file => uploadSingleImage(file));
        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach(result => {
          if (result) results.push(result);
        });

        const progressPercent = Math.min((currentBatch / totalBatches) * 100, 100);
        setUploadProgress(progressPercent);

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (results.length > 0) {
        setProgress('¡Éxito! ' + results.length + ' imágenes subidas.');
        setUploadProgress(100);
        
        const initialData = results.map((item, index) => ({
          id: index,
          name: item.name.replace(/[_-]/g, ' ').replace(/\.[^/.]+$/, '').trim(),
          image_url: item.url,
          price: bulkPrice,
          stock: bulkStock,
          description: bulkDescription,
          category: bulkCategory
        }));
        
        setCsvData(initialData);
      } else {
        setProgress('Ninguna imagen pudo ser subida.');
      }
    } catch (error) {
      setProgress('Error de conexión al subir las imágenes.');
    } finally {
      setUploading(false);
    }
  };

  const updateField = (index: number, field: string, value: any) => {
    const newData = [...csvData];
    newData[index] = { ...newData[index], [field]: value };
    setCsvData(newData);
  };

  const applyBulkChanges = () => {
    const newData = csvData.map(item => ({
      ...item,
      category: bulkCategory,
      description: bulkDescription,
      price: bulkPrice,
      stock: bulkStock
    }));
    setCsvData(newData);
  };

  const downloadCSV = () => {
    if (csvData.length === 0) return;

    const headers = ['name', 'image_url', 'price', 'stock', 'description', 'category'];
    
    let csvContent = headers.join(',') + '\n';
    
    csvData.forEach(row => {
      const line = '"' + row.name + '","' + row.image_url + '",' + row.price + ',' + row.stock + ',"' + row.description + '","' + row.category + '"';
      csvContent += line + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'catalogo_productos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #f0fdf4 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* BOTÓN DE REGRESO */}
        <Link 
          href="/admin" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            background: '#6B2D8B',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'background 0.2s'
          }}
        >
          <ArrowLeft size={20} />
          Regreso
        </Link>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#6B2D8B',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <FileSpreadsheet size={40} />
          Generar CSV desde Fotos
        </h1>

        {/* SECCIÓN 1: SUBIDA */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 40px rgba(107, 45, 139, 0.15)',
          padding: '2rem',
          marginBottom: '2rem',
          border: '2px solid #e5e7eb'
        }}>
          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#374151',
              display: 'block',
              marginBottom: '1rem'
            }}>
              Paso 1: Selecciona las imágenes
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                border: '2px solid #6B2D8B',
                borderRadius: '0.75rem',
                background: '#faf5ff',
                cursor: 'pointer'
              }}
            />
          </label>

          {files.length > 0 && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#eff6ff',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#1e40af', fontWeight: '600' }}>
                {files.length} archivos seleccionados
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            style={{
              width: '100%',
              background: uploading || files.length === 0 ? '#9ca3af' : 'linear-gradient(135deg, #1B8A3B 0%, #2ECC71 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              cursor: uploading || files.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 15px rgba(27, 138, 59, 0.3)',
              transition: 'transform 0.2s'
            }}
          >
            <Upload size={24} />
            {uploading ? 'Subiendo imágenes...' : 'Subir Imágenes'}
          </button>

          {/* BARRA DE PROGRESO */}
          {uploading && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ fontWeight: 'bold', color: '#374151', fontSize: '1.125rem' }}>
                  Progreso de subida:
                </span>
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  color: uploadProgress <= 50 ? '#6B2D8B' : '#1B8A3B'
                }}>
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              
              <div style={{
                width: '100%',
                background: '#e5e7eb',
                borderRadius: '9999px',
                height: '2rem',
                overflow: 'hidden',
                border: '2px solid #d1d5db'
              }}>
                <div 
                  style={{ 
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'all 0.7s ease-out',
                    width: uploadProgress + '%',
                    background: uploadProgress <= 50 
                      ? 'linear-gradient(90deg, #6B2D8B 0%, #8B45B3 100%)' 
                      : 'linear-gradient(90deg, #1B8A3B 0%, #2ECC71 100%)'
                  }}
                ></div>
              </div>
              
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'linear-gradient(90deg, #eff6ff 0%, #faf5ff 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <p style={{ color: '#374151', fontWeight: '600', fontSize: '1.125rem' }}>
                  {progress}
                </p>
              </div>
            </div>
          )}

          {!uploading && progress && uploadProgress === 0 && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: 'linear-gradient(90deg, #f0fdf4 0%, #ecfdf5 100%)',
              borderLeft: '4px solid #22c55e',
              borderRadius: '0.5rem'
            }}>
              <p style={{ color: '#166534', fontWeight: '600', fontSize: '1.125rem' }}>
                {progress}
              </p>
            </div>
          )}
        </div>

        {/* SECCIÓN 2: EDICIÓN DE DATOS */}
        {csvData.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(107, 45, 139, 0.15)',
            padding: '2rem',
            border: '2px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Save size={32} style={{ color: '#6B2D8B' }} />
              Paso 2: Revisa y Edita los Datos
            </h2>

            {/* PLANTILLA AZUL */}
            <div style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '1rem',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
              border: '2px solid #93c5fd'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={28} style={{ color: '#fde047' }} />
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  Plantilla de Datos Masivos
                </h3>
              </div>
              <p style={{ color: '#dbeafe', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                Define los valores que se aplicarán a TODOS los productos.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#dbeafe',
                    marginBottom: '0.5rem'
                  }}>
                    Categoría
                  </label>
                  <select 
                    value={bulkCategory} 
                    onChange={(e) => setBulkCategory(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'white',
                      border: '2px solid #93c5fd',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}
                  >
                    {categories.length === 0 ? (
                      <option value="">Cargando...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#dbeafe',
                    marginBottom: '0.5rem'
                  }}>
                    Precio
                  </label>
                  <input 
                    type="number" 
                    value={bulkPrice} 
                    onChange={(e) => setBulkPrice(Number(e.target.value))}
                    style={{
                      width: '100%',
                      background: 'white',
                      border: '2px solid #93c5fd',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#dbeafe',
                    marginBottom: '0.5rem'
                  }}>
                    Stock
                  </label>
                  <input 
                    type="number" 
                    value={bulkStock} 
                    onChange={(e) => setBulkStock(Number(e.target.value))}
                    style={{
                      width: '100%',
                      background: 'white',
                      border: '2px solid #93c5fd',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}
                    placeholder="1"
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#dbeafe',
                    marginBottom: '0.5rem'
                  }}>
                    Descripción
                  </label>
                  <input 
                    type="text" 
                    value={bulkDescription} 
                    onChange={(e) => setBulkDescription(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'white',
                      border: '2px solid #93c5fd',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}
                    placeholder="Descripción del producto"
                  />
                </div>
              </div>
              
              <button 
                onClick={applyBulkChanges}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)',
                  transition: 'transform 0.2s'
                }}
              >
                <CheckCircle size={24} />
                Aplicar a TODOS los productos
              </button>
            </div>

            {/* TABLA MULTICOLOR */}
            <div style={{
              overflowX: 'auto',
              maxHeight: '500px',
              overflowY: 'auto',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(90deg, #6B2D8B 0%, #8B45B3 100%)',
                    color: 'white',
                    position: 'sticky',
                    top: 0,
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                  }}>
                    <th style={{ padding: '1rem', textAlign: 'center', width: '80px' }}>Imagen</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
                    <th style={{ padding: '1rem', textAlign: 'center', width: '120px' }}>Precio</th>
                    <th style={{ padding: '1rem', textAlign: 'center', width: '100px' }}>Stock</th>
                    <th style={{ padding: '1rem', textAlign: 'center', width: '150px' }}>Categoría</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, index) => (
                    <tr key={row.id} style={{
                      borderBottom: '1px solid #e5e7eb',
                      background: index % 2 === 0 ? 'white' : '#f9fafb',
                      transition: 'background 0.2s'
                    }}>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <img 
                          src={row.image_url} 
                          alt="preview" 
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '0.5rem',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                            border: '2px solid #e5e7eb'
                          }} 
                        />
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <input 
                          type="text" 
                          value={row.name} 
                          onChange={(e) => updateField(index, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            border: '2px solid #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <input 
                          type="number" 
                          value={row.price} 
                          onChange={(e) => updateField(index, 'price', Number(e.target.value))}
                          style={{
                            width: '100%',
                            border: '2px solid #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <input 
                          type="number" 
                          value={row.stock} 
                          onChange={(e) => updateField(index, 'stock', Number(e.target.value))}
                          style={{
                            width: '100%',
                            border: '2px solid #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <input 
                          type="text" 
                          value={row.category} 
                          onChange={(e) => updateField(index, 'category', e.target.value)}
                          style={{
                            width: '100%',
                            border: '2px solid #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textAlign: 'center'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <input 
                          type="text" 
                          value={row.description} 
                          onChange={(e) => updateField(index, 'description', e.target.value)}
                          style={{
                            width: '100%',
                            border: '2px solid #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            fontSize: '0.875rem'
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* BOTÓN DE DESCARGA */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '2px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={32} style={{ color: '#1B8A3B' }} />
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total de productos listos:</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6B2D8B' }}>{csvData.length}</p>
                </div>
              </div>
              <button
                onClick={downloadCSV}
                style={{
                  background: 'linear-gradient(135deg, #1B8A3B 0%, #2ECC71 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '1rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 4px 15px rgba(27, 138, 59, 0.4)',
                  transition: 'transform 0.2s'
                }}
              >
                <Download size={24} />
                Descargar CSV Editado
              </button>
            </div>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '1.5rem',
              textAlign: 'center',
              padding: '1rem',
              background: '#fefce8',
              borderLeft: '4px solid #eab308',
              borderRadius: '0.5rem'
            }}>
              Tip: Usa la plantilla azul para llenar categoría, precio, stock y descripción masivamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
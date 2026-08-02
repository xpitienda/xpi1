'use client';

import { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Save } from 'lucide-react';

export default function GenerateCSVPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [csvData, setCsvData] = useState<any[]>([]);
  
  const [bulkCategory, setBulkCategory] = useState('Tecnología');
  const [bulkDescription, setBulkDescription] = useState('Producto de alta calidad.');
  const [bulkPrice, setBulkPrice] = useState(0);
  const [bulkStock, setBulkStock] = useState(1);

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

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (results.length > 0) {
        setProgress('¡Éxito! ' + results.length + ' imágenes subidas.');
        
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#6B2D8B] flex items-center gap-2">
        <FileSpreadsheet className="w-8 h-8" />
        Generar CSV desde Fotos
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
        <label className="block mb-4">
          <span className="text-lg font-semibold text-gray-700 block mb-2">
            1. Selecciona las imágenes
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-[#6B2D8B] file:text-white
              hover:file:bg-[#5a2575]
              disabled:opacity-50 cursor-pointer"
          />
        </label>

        {files.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">📁 {files.length} archivos seleccionados</p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="w-full bg-[#1B8A3B] hover:bg-[#156d2e] disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          {uploading ? 'Subiendo...' : 'Subir Imágenes'}
        </button>

        {progress && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm font-medium">
            {progress}
          </div>
        )}
      </div>

      {csvData.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Save className="w-6 h-6 text-[#6B2D8B]" />
            2. Revisa y Edita los Datos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría:</label>
              <select 
                value={bulkCategory} 
                onChange={(e) => setBulkCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option>Tecnología</option>
                <option>Ropa</option>
                <option>Hogar</option>
                <option>Deportes</option>
                <option>Accesorios</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Precio:</label>
              <input 
                type="number" 
                value={bulkPrice} 
                onChange={(e) => setBulkPrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Stock:</label>
              <input 
                type="number" 
                value={bulkStock} 
                onChange={(e) => setBulkStock(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción:</label>
              <input 
                type="text" 
                value={bulkDescription} 
                onChange={(e) => setBulkDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <button 
                onClick={applyBulkChanges}
                className="bg-[#6B2D8B] hover:bg-[#5a2575] text-white text-sm font-bold py-2 px-4 rounded transition"
              >
                Aplicar estos valores a TODOS los productos
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 w-20">Imagen</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3 w-24">Precio</th>
                  <th className="px-4 py-3 w-20">Stock</th>
                  <th className="px-4 py-3 w-32">Categoría</th>
                  <th className="px-4 py-3">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, index) => (
                  <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">
                      <img src={row.image_url} alt="preview" className="w-10 h-10 object-cover rounded mx-auto" />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={row.name} 
                        onChange={(e) => updateField(index, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#6B2D8B] focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        value={row.price} 
                        onChange={(e) => updateField(index, 'price', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-[#1B8A3B] focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="number" 
                        value={row.stock} 
                        onChange={(e) => updateField(index, 'stock', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-[#1B8A3B] focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={row.category} 
                        onChange={(e) => updateField(index, 'category', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-1 focus:ring-[#6B2D8B] focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={row.description} 
                        onChange={(e) => updateField(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#6B2D8B] focus:outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total de productos: <span className="font-bold text-[#6B2D8B]">{csvData.length}</span>
            </p>
            <button
              onClick={downloadCSV}
              className="bg-[#1B8A3B] hover:bg-[#156d2e] text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
            >
              <Download size={20} />
              Descargar CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
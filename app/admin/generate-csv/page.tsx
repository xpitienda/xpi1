'use client';

import { useState } from 'react';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';

export default function GenerateCSVPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadSingleImage = async (file: File): Promise<{ name: string; url: string } | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file); // Nota: 'file' en singular

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
      console.error(`Error subiendo ${file.name}:`, error);
      return null;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(`Preparando ${files.length} imágenes para subir...`);

    try {
      const results: { name: string; url: string }[] = [];
      const errors: string[] = [];

      // Subir en lotes de 5 imágenes simultáneas
      const batchSize = 5;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        setProgress(`Subiendo lote ${Math.floor(i / batchSize) + 1} de ${Math.ceil(files.length / batchSize)} (${batch.length} imágenes)...`);

        const batchPromises = batch.map(file => uploadSingleImage(file));
        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach((result, index) => {
          if (result) {
            results.push(result);
          } else {
            errors.push(batch[index].name);
          }
        });

        // Pequeña pausa entre lotes
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (results.length > 0) {
        setProgress(`✅ ¡Éxito! ${results.length} imágenes subidas. ${errors.length > 0 ? `${errors.length} fallaron.` : ''}`);
        
        // Generar datos para el CSV
        const newCsvData = results.map((item) => ({
          name: item.name.replace(/[_-]/g, ' ').replace(/\.[^/.]+$/, ''),
          image_url: item.url,
          price: 0,
          stock: 1,
          description: 'Pendiente de descripción',
          category: 'Tecnología'
        }));
        
        setCsvData(newCsvData);
      } else {
        setProgress(' Ninguna imagen pudo ser subida.');
      }
    } catch (error) {
      setProgress('❌ Error de conexión al subir las imágenes.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const downloadCSV = () => {
    if (csvData.length === 0) return;

    const headers = ['name', 'image_url', 'price', 'stock', 'description', 'category'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        `"${row.name}","${row.image_url}",${row.price},${row.stock},"${row.description}","${row.category}"`
      )
    ].join('\n');

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#6B2D8B] flex items-center gap-2">
        <FileSpreadsheet /> Generar CSV desde Fotos
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <label className="block mb-4">
          <span className="text-lg font-semibold text-gray-700 block mb-2">
            Selecciona las imágenes del catálogo (Recomendado: 50 a la vez)
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-[#6B2D8B] file:text-white
              hover:file:bg-[#5a2575]
              disabled:opacity-50 cursor-pointer"
          />
        </label>

        {files.length > 0 && (
          <p className="text-sm text-gray-600 mb-4">
            📁 {files.length} archivos seleccionados
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="w-full bg-[#1B8A3B] hover:bg-[#156d2e] disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          {uploading ? 'Subiendo...' : 'Subir Imágenes y Generar CSV'}
        </button>

        {progress && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            {progress}
          </div>
        )}

        {csvData.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={downloadCSV}
              className="w-full bg-[#6B2D8B] hover:bg-[#5a2575] text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Descargar CSV ({csvData.length} productos)
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Abre el CSV en Excel, edita los precios y descripciones, y luego usa "Carga Masiva" para importarlos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
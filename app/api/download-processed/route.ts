import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const processedDir = path.join(process.cwd(), 'uploads', 'processed');

    // Verificar si la carpeta existe
    const dirExists = await fs.access(processedDir).then(() => true).catch(() => false);
    
    if (!dirExists) {
      return NextResponse.json({ error: 'No hay carpeta de imágenes procesadas' }, { status: 404 });
    }

    // Leer archivos de la carpeta
    const files = await fs.readdir(processedDir);
    const imageFiles = files.filter(f => 
      f.toLowerCase().endsWith('.jpg') || 
      f.toLowerCase().endsWith('.jpeg') || 
      f.toLowerCase().endsWith('.png') ||
      f.toLowerCase().endsWith('.webp')
    );
    
    if (imageFiles.length === 0) {
      return NextResponse.json({ error: 'No hay imágenes para descargar' }, { status: 404 });
    }

    // Crear ZIP con JSZip
    const zip = new JSZip();
    
    for (const file of imageFiles) {
      const filePath = path.join(processedDir, file);
      const fileData = await fs.readFile(filePath);
      zip.file(file, fileData);
    }

    // Generar el ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });

    // Configurar headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', `attachment; filename="imagenes_xpitienda_${Date.now()}.zip"`);

    return new Response(zipBuffer, { headers });

  } catch (error) {
    console.error('Error creando ZIP:', error);
    return NextResponse.json({ error: 'Error creando el ZIP' }, { status: 500 });
  }
}
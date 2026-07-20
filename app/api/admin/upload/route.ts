import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No se encontró el archivo' }, { status: 400 });
    }

    // Generar nombre único
    const extension = file.name.split('.').pop();
    const fileName = `product_${uuidv4()}.${extension}`;
    
    // Aquí subirías a un servicio de almacenamiento (ej: Cloudinary, S3)
    // Por ahora simulamos una URL
    const imageUrl = `https://example.com/images/${fileName}`;

    // ✅ CORREGIDO: Actualiza la tabla 'products' y el campo 'image_url'
    await turso.execute({
      sql: 'UPDATE products SET image_url = ? WHERE id = ?',
      args: [imageUrl, productId]
    });

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
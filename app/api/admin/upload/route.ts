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
    
    // Aquí deberías subir a un servicio de almacenamiento
    // Por ahora solo simulamos
    const imageUrl = `https://example.com/images/${fileName}`;

    // Actualizar imagen en la tabla CORRECTA 'catalog'
    await turso.execute({
      sql: 'UPDATE catalog SET image = ? WHERE id = ?',
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
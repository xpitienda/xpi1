import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se encontró el archivo' }, { status: 400 });
    }

    // Procesar el archivo CSV
    const text = await file.text();
    const rows = text.split('\n').slice(1); // Ignorar encabezado

    const errors: string[] = [];
    const products: any[] = [];

    for (const row of rows) {
      const [name, description, price, stock, category_id, image] = row.split(',');
      
      if (!name || !price || stock === undefined) {
        errors.push(`Fila inválida: ${row}`);
        continue;
      }

      try {
        // Insertar en la tabla CORRECTA 'catalog'
        const result = await turso.execute({
          sql: 'INSERT INTO catalog (name, description, price, stock, category_id, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
          args: [
            name.trim(),
            description?.trim() || null,
            Number(price),
            Number(stock),
            category_id?.trim() || null,
            image?.trim() || null,
            1
          ]
        });

        products.push({
          id: result.lastInsertRowid,
          name,
          price: Number(price),
          stock: Number(stock)
        });
      } catch (err) {
        // CORREGIDO: Manejar error de tipo unknown
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        errors.push(`Error al procesar ${name}: ${errorMessage}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: true, 
          products, 
          errors 
        }, 
        { status: 207 } // Multi-Status
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error en carga masiva:', error);
    return NextResponse.json({ error: 'Error al procesar el archivo' }, { status: 500 });
  }
}
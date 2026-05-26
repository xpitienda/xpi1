// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Aseguramos recibir la categoría (si no viene, usa 'General')
    const { name, description, price, image_url, category = 'General', stock = 1, is_active = 1 } = body;

    // Consulta SQL INSERT incluyendo la columna 'category'
    const sql = `
      INSERT INTO catalog (name, description, price, image_url, category, stock, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const args = [name, description, price, image_url, category, stock, is_active];

    await turso.execute({ sql, args });

    return NextResponse.json({ message: 'Producto creado exitosamente' }, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const result = await turso.execute('SELECT * FROM catalog WHERE is_active = 1 ORDER BY created_at DESC');
  return NextResponse.json(result.rows);
}
export const dynamic = 'force-dynamic';
export const revalidate = 0;
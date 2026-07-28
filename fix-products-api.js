const fs = require('fs');
const path = require('path');

const content = `import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const result = await turso.execute(
      'SELECT id, name, price, stock, is_active, image_url, category, description FROM catalog WHERE is_active = 1 ORDER BY name'
    );

    return NextResponse.json(Array.from(result.rows));
  } catch (error: any) {
    console.error('Error cargando productos:', error);
    return NextResponse.json({ error: 'Error al cargar productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, category, image_url, is_active } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Nombre y precio son obligatorios' }, { status: 400 });
    }

    const newId = randomUUID();

    await turso.execute({
      sql: \`INSERT INTO catalog (id, name, description, price, stock, category, image_url, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,
      args: [
        newId,
        name,
        description || null,
        Number(price),
        Number(stock) || 0,
        category || 'General',
        image_url || null,
        is_active !== undefined ? is_active : 1
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Producto creado exitosamente',
      id: newId
    });
  } catch (error: any) {
    console.error('Error creando producto:', error);
    return NextResponse.json({ error: 'Error al crear el producto: ' + error.message }, { status: 500 });
  }
}
`;

const filePath = path.join(process.cwd(), 'app', 'api', 'admin', 'products', 'route.ts');
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Archivo app/api/admin/products/route.ts corregido correctamente.');

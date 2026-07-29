const fs = require('fs');
const path = require('path');

// 1. Crear API Admin
const adminApiContent = `import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM advanced_banners ORDER BY display_order ASC, created_at DESC');
    return NextResponse.json(Array.from(result.rows));
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al cargar banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, image_url, link_url, start_date, end_date, display_order } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Título e imagen son obligatorios' }, { status: 400 });
    }

    const newId = randomUUID();

    await turso.execute({
      sql: \`INSERT INTO advanced_banners (id, title, image_url, link_url, start_date, end_date, display_order, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)\`,
      args: [newId, title, image_url, link_url || null, start_date || null, end_date || null, Number(display_order) || 0, 1]
    });

    return NextResponse.json({ success: true, message: 'Banner creado', id: newId });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al crear: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, image_url, link_url, start_date, end_date, display_order, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await turso.execute({
      sql: \`UPDATE advanced_banners SET title = ?, image_url = ?, link_url = ?, start_date = ?, end_date = ?, display_order = ?, is_active = ? WHERE id = ?\`,
      args: [title, image_url, link_url || null, start_date || null, end_date || null, Number(display_order) || 0, is_active, id]
    });

    return NextResponse.json({ success: true, message: 'Banner actualizado' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await turso.execute({ sql: 'DELETE FROM advanced_banners WHERE id = ?', args: [id] });
    return NextResponse.json({ success: true, message: 'Banner eliminado' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al eliminar: ' + error.message }, { status: 500 });
  }
}
`;

// 2. Crear API Pública
const publicApiContent = `import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await turso.execute({
      sql: \`SELECT * FROM advanced_banners 
            WHERE is_active = 1 
            AND (start_date IS NULL OR start_date <= ?) 
            AND (end_date IS NULL OR end_date >= ?)
            ORDER BY display_order ASC, created_at DESC\`,
      args: [today, today]
    });

    return NextResponse.json(Array.from(result.rows));
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al cargar banners' }, { status: 500 });
  }
}
`;

// Crear directorios y escribir archivos
const adminDir = path.join(process.cwd(), 'app', 'api', 'admin', 'advanced-banners');
const publicDir = path.join(process.cwd(), 'app', 'api', 'advanced-banners');

fs.mkdirSync(adminDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(adminDir, 'route.ts'), adminApiContent, 'utf8');
fs.writeFileSync(path.join(publicDir, 'route.ts'), publicApiContent, 'utf8');

console.log('✅ APIs de advanced-banners creadas correctamente:');
console.log('   - app/api/admin/advanced-banners/route.ts');
console.log('   - app/api/advanced-banners/route.ts');

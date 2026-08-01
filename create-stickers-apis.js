const fs = require('fs');
const path = require('path');

// 1. API Admin (CRUD)
const adminApiDir = path.join(process.cwd(), 'app', 'api', 'admin', 'stickers');
fs.mkdirSync(adminApiDir, { recursive: true });

const adminApiContent = `import { turso } from '@/lib/turso';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM stickers ORDER BY created_at DESC');
    return NextResponse.json(result.rows || []);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pegatinas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, message, points, color_start, color_end, text_color, start_date, end_date, is_active } = body;
    
    const id = crypto.randomUUID();
    await turso.execute({
      sql: \`INSERT INTO stickers (id, product_id, message, points, color_start, color_end, text_color, start_date, end_date, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
      args: [id, product_id, message, points || 6, color_start || '#FF006E', color_end || '#FFBE0B', text_color || '#FFFFFF', start_date, end_date, is_active !== undefined ? is_active : 1]
    });
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear pegatina' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, product_id, message, points, color_start, color_end, text_color, start_date, end_date, is_active } = body;
    
    await turso.execute({
      sql: \`UPDATE stickers SET product_id = ?, message = ?, points = ?, color_start = ?, color_end = ?, text_color = ?, start_date = ?, end_date = ?, is_active = ? WHERE id = ?\`,
      args: [product_id, message, points, color_start, color_end, text_color, start_date, end_date, is_active, id]
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar pegatina' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    
    await turso.execute({ sql: 'DELETE FROM stickers WHERE id = ?', args: [id] });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar pegatina' }, { status: 500 });
  }
}
`;

fs.writeFileSync(path.join(adminApiDir, 'route.ts'), adminApiContent, 'utf8');

// 2. API Pública (Solo pegatinas activas y vigentes)
const publicApiDir = path.join(process.cwd(), 'app', 'api', 'stickers');
fs.mkdirSync(publicApiDir, { recursive: true });

const publicApiContent = `import { turso } from '@/lib/turso';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await turso.execute({
      sql: \`SELECT * FROM stickers 
            WHERE is_active = 1 
            AND start_date <= ? 
            AND end_date >= ?\`,
      args: [today, today]
    });
    return NextResponse.json(result.rows || []);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pegatinas' }, { status: 500 });
  }
}
`;

fs.writeFileSync(path.join(publicApiDir, 'route.ts'), publicApiContent, 'utf8');

console.log('✅ APIs de pegatinas (Admin y Pública) creadas correctamente.');

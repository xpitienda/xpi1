import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// Asegura que la tabla exista antes de operar
async function ensureTable() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      parent_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Genera un id de texto único para la categoría
function generateId() {
  return 'cat_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  try {
    await ensureTable();
    const result = await turso.execute('SELECT * FROM categories ORDER BY name ASC');
    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error('[v0] Error cargando categorías:', error);
    return NextResponse.json(
      { error: 'Error al cargar categorías', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const { name, parent_id } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    // Validar que el padre exista si se envía uno
    if (parent_id) {
      const parent = await turso.execute({
        sql: 'SELECT id FROM categories WHERE id = ?',
        args: [parent_id],
      });
      if (parent.rows.length === 0) {
        return NextResponse.json({ error: 'La categoría padre no existe' }, { status: 400 });
      }
    }

    const id = generateId();

    await turso.execute({
      sql: 'INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?)',
      args: [id, name.trim(), parent_id || null],
    });

    return NextResponse.json({ id, name: name.trim(), parent_id: parent_id || null });
  } catch (error) {
    console.error('[v0] Error creando categoría:', error);
    return NextResponse.json(
      { error: 'Error al crear categoría', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTable();
    const { id, name, parent_id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }
    // Evitar que una categoría sea su propio padre
    if (parent_id && parent_id === id) {
      return NextResponse.json({ error: 'Una categoría no puede ser su propio padre' }, { status: 400 });
    }

    await turso.execute({
      sql: 'UPDATE categories SET name = ?, parent_id = ? WHERE id = ?',
      args: [name.trim(), parent_id || null, id],
    });

    return NextResponse.json({ id, name: name.trim(), parent_id: parent_id || null });
  } catch (error) {
    console.error('[v0] Error actualizando categoría:', error);
    return NextResponse.json(
      { error: 'Error al actualizar categoría', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    // Borrado en cascada manual (las FK pueden no estar activas en libsql)
    await turso.execute({
      sql: 'DELETE FROM categories WHERE parent_id = ?',
      args: [id],
    });
    await turso.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Error eliminando categoría:', error);
    return NextResponse.json(
      { error: 'Error al eliminar categoría', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

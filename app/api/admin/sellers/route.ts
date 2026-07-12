import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Función para asegurar que la tabla exista (Autocuración)
async function ensureSellersTable() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS sellers (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        id_number TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        assigned_series_id TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    // Crear índice si no existe
    await turso.execute(`CREATE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email)`);
  } catch (e) {
    console.error('Error creando tabla sellers:', e);
  }
}

export async function GET() {
  try {
    await ensureSellersTable(); // Asegurar tabla al leer
    const result = await turso.execute(`
      SELECT s.*, ic.prefix_letter, ic.city_letter 
      FROM sellers s
      LEFT JOIN invoice_counters ic ON s.assigned_series_id = ic.id
      ORDER BY s.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[GET] Error sellers:', error);
    return NextResponse.json({ error: 'Error al obtener vendedores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureSellersTable(); // Asegurar tabla al crear

    const body = await request.json();
    const { full_name, email, phone, id_number, password, assigned_series_id } = body;

    if (!full_name || !email || !phone || !id_number || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanId = String(id_number).trim();

    // Verificar unicidad
    const existing = await turso.execute({
      sql: 'SELECT id FROM sellers WHERE email = ? OR id_number = ?',
      args: [cleanEmail, cleanId]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'El email o documento ya está registrado' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(String(password), 10);

    await turso.execute({
      sql: `INSERT INTO sellers (full_name, email, phone, id_number, password_hash, assigned_series_id, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      args: [
        String(full_name).trim(),
        cleanEmail,
        String(phone).trim(),
        cleanId,
        password_hash,
        assigned_series_id || null
      ],
    });

    return NextResponse.json({ success: true, message: 'Vendedor creado correctamente' });

  } catch (error: any) {
    console.error('[POST] Error sellers:', error);
    return NextResponse.json({ error: `Error al crear vendedor: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, full_name, email, phone, id_number, assigned_series_id, is_active } = body;

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    await turso.execute({
      sql: `UPDATE sellers SET 
              full_name = COALESCE(?, full_name),
              email = COALESCE(?, email),
              phone = COALESCE(?, phone),
              id_number = COALESCE(?, id_number),
              assigned_series_id = COALESCE(?, assigned_series_id),
              is_active = COALESCE(?, is_active)
            WHERE id = ?`,
      args: [
        full_name?.trim() || null,
        email?.toLowerCase().trim() || null,
        phone?.trim() || null,
        id_number?.trim() || null,
        assigned_series_id || null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        id
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[PUT] Error sellers:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const result = await turso.execute({ sql: 'DELETE FROM sellers WHERE id = ?', args: [String(id)] });
    if (result.rowsAffected === 0) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE] Error sellers:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
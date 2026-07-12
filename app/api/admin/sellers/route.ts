import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// GET: Listar todos los vendedores + sus series asignadas
export async function GET() {
  try {
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

// POST: Crear nuevo vendedor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, id_number, password, assigned_series_id } = body;

    if (!full_name || !email || !phone || !id_number || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Verificar que email y documento sean únicos
    const existing = await turso.execute(
      'SELECT id FROM sellers WHERE email = ? OR id_number = ?',
      [email.toLowerCase().trim(), id_number.trim()]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'El email o documento ya está registrado' }, { status: 409 });
    }

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);

    await turso.execute({
      sql: 'INSERT INTO sellers (full_name, email, phone, id_number, password_hash, assigned_series_id) VALUES (?, ?, ?, ?, ?, ?)',
      args: [
        full_name.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        id_number.trim(),
        password_hash,
        assigned_series_id || null,
      ],
    });

    return NextResponse.json({ success: true, message: 'Vendedor creado correctamente' });
  } catch (error) {
    console.error('[POST] Error sellers:', error);
    return NextResponse.json({ error: 'Error al crear vendedor' }, { status: 500 });
  }
}

// PUT: Actualizar vendedor (sin cambiar contraseña)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, full_name, email, phone, id_number, assigned_series_id, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await turso.execute({
      sql: 'UPDATE sellers SET full_name = ?, email = ?, phone = ?, id_number = ?, assigned_series_id = ?, is_active = ? WHERE id = ?',
      args: [
        full_name?.trim(),
        email?.toLowerCase().trim(),
        phone?.trim(),
        id_number?.trim(),
        assigned_series_id || null,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        id,
      ],
    });

    return NextResponse.json({ success: true, message: 'Vendedor actualizado' });
  } catch (error) {
    console.error('[PUT] Error sellers:', error);
    return NextResponse.json({ error: 'Error al actualizar vendedor' }, { status: 500 });
  }
}

// DELETE: Eliminar vendedor
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const result = await turso.execute('DELETE FROM sellers WHERE id = ?', [id]);

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Vendedor no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Vendedor eliminado' });
  } catch (error) {
    console.error('[DELETE] Error sellers:', error);
    return NextResponse.json({ error: 'Error al eliminar vendedor' }, { status: 500 });
  }
}
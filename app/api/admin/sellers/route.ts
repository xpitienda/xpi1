import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validación estricta de campos
    const { full_name, email, phone, id_number, password, assigned_series_id } = body;

    if (!full_name || !email || !phone || !id_number || !password) {
      return NextResponse.json({ 
        error: 'Todos los campos son obligatorios: nombre, email, celular, documento y contraseña' 
      }, { status: 400 });
    }

    // Limpiar y normalizar datos
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanId = String(id_number).trim();
    const cleanPhone = String(phone).trim();
    const cleanName = String(full_name).trim();

    // Verificar unicidad de email y documento
    const existing = await turso.execute({
      sql: 'SELECT id, email, id_number FROM sellers WHERE email = ? OR id_number = ?',
      args: [cleanEmail, cleanId]
    });

    if (existing.rows.length > 0) {
      const row = existing.rows[0] as any;
      if (row.email === cleanEmail) {
        return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 409 });
      }
      if (row.id_number === cleanId) {
        return NextResponse.json({ error: 'El número de documento ya está registrado' }, { status: 409 });
      }
    }

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(String(password), 10);

    // Insertar vendedor
    await turso.execute({
      sql: `INSERT INTO sellers (full_name, email, phone, id_number, password_hash, assigned_series_id, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      args: [
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanId,
        password_hash,
        assigned_series_id || null
      ],
    });

    return NextResponse.json({ success: true, message: 'Vendedor creado correctamente' });

  } catch (error: any) {
    console.error('[POST] Error detallado sellers:', error);
    // Retornar mensaje de error específico si es posible
    const errorMsg = error.message || 'Error desconocido al crear vendedor';
    return NextResponse.json({ error: `Error al crear vendedor: ${errorMsg}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, full_name, email, phone, id_number, assigned_series_id, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

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

    return NextResponse.json({ success: true, message: 'Vendedor actualizado' });
  } catch (error: any) {
    console.error('[PUT] Error sellers:', error);
    return NextResponse.json({ error: 'Error al actualizar vendedor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: 'DELETE FROM sellers WHERE id = ?',
      args: [String(id)]
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Vendedor no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Vendedor eliminado' });
  } catch (error: any) {
    console.error('[DELETE] Error sellers:', error);
    return NextResponse.json({ error: 'Error al eliminar vendedor' }, { status: 500 });
  }
}
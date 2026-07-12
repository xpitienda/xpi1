import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// GET: Obtener historial de series
export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM invoice_counters ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error GET invoice-counter:', error);
    return NextResponse.json({ error: 'Error al obtener contadores' }, { status: 500 });
  }
}

// POST: Crear nueva serie y activarla
export async function POST(request: Request) {
  try {
    const { prefix_letter, city_letter, start_number } = await request.json();
    
    if (!prefix_letter || !city_letter) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Desactivar todas las anteriores
    await turso.execute('UPDATE invoice_counters SET is_active = FALSE');
    
    // Insertar la nueva serie como activa
    await turso.execute({
      sql: 'INSERT INTO invoice_counters (prefix_letter, city_letter, current_number, is_active) VALUES (?, ?, ?, TRUE)',
      args: [String(prefix_letter).toUpperCase(), String(city_letter).toUpperCase(), Number(start_number) || 0],
    });
    
    return NextResponse.json({ success: true, message: 'Serie activada correctamente' });
  } catch (error) {
    console.error('Error POST invoice-counter:', error);
    return NextResponse.json({ error: 'Error al crear serie: ' + (error as Error).message }, { status: 500 });
  }
}

// DELETE: Eliminar una serie específica
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID de serie requerido' }, { status: 400 });
    }

    // Ejecutar eliminación
    const result = await turso.execute({
      sql: 'DELETE FROM invoice_counters WHERE id = ?',
      args: [String(id)],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Serie no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Serie eliminada correctamente' });
  } catch (error) {
    console.error('Error DELETE invoice-counter:', error);
    return NextResponse.json({ error: 'Error al eliminar: ' + (error as Error).message }, { status: 500 });
  }
}
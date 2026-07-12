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
    
    // Desactivar todas las anteriores para que solo haya una activa
    await turso.execute('UPDATE invoice_counters SET is_active = FALSE');
    
    // Insertar la nueva serie como activa
    await turso.execute({
      sql: 'INSERT INTO invoice_counters (prefix_letter, city_letter, current_number, is_active) VALUES (?, ?, ?, TRUE)',
      args: [prefix_letter.toUpperCase(), city_letter.toUpperCase(), start_number || 0],
    });
    
    return NextResponse.json({ success: true, message: 'Serie activada correctamente' });
  } catch (error) {
    console.error('Error POST invoice-counter:', error);
    return NextResponse.json({ error: 'Error al crear serie' }, { status: 500 });
  }
}

// DELETE: Eliminar una serie específica
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    // Eliminar de la base de datos
    await turso.execute('DELETE FROM invoice_counters WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true, message: 'Serie eliminada' });
  } catch (error) {
    console.error('Error DELETE invoice-counter:', error);
    return NextResponse.json({ error: 'Error al eliminar serie' }, { status: 500 });
  }
}
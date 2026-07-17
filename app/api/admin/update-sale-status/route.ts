import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function PATCH(request: Request) {
  try {
    const { saleId, status } = await request.json();

    if (!saleId || !status) {
      return NextResponse.json({ error: 'saleId y status son requeridos' }, { status: 400 });
    }

    const validStatuses = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    await turso.execute({
      sql: 'UPDATE sales SET status = ? WHERE id = ?',
      args: [status, saleId]
    });

    return NextResponse.json({ 
      success: true, 
      message: `Estado actualizado a: ${status}` 
    });

  } catch (error: any) {
    console.error('Error actualizando estado:', error);
    return NextResponse.json({ 
      error: 'Error al actualizar estado: ' + error.message 
    }, { status: 500 });
  }
}
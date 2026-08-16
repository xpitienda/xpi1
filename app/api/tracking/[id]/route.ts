import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // ⚠️ IMPORTANTE: En Next.js 16, params es una promesa
    const { id } = await params;
    
    console.log('🔍 Buscando envío con ID:', id);
    
    // Obtener datos del envío
    const shipmentResult = await turso.execute({
      sql: `SELECT s.*, cc.name as courier_name, cc.code as courier_code, cc.tracking_url
            FROM shipments s
            LEFT JOIN courier_companies cc ON s.courier_company_id = cc.id
            WHERE s.id = ?`,
      args: [Number(id)]
    });
    
    console.log('📦 Resultado shipments:', shipmentResult);
    
    const shipment = shipmentResult.rows?.[0];
    if (!shipment) {
      return NextResponse.json({ error: 'Envío no encontrado' }, { status: 404 });
    }
    
    // Obtener eventos
    const eventsResult = await turso.execute({
      sql: 'SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY event_date ASC',
      args: [Number(id)]
    });
    
    console.log(' Eventos:', eventsResult);
    
    return NextResponse.json({
      shipment,
      events: eventsResult.rows || []
    });
  } catch (error: any) {
    console.error('❌ Error completo:', error);
    console.error('❌ Mensaje:', error.message);
    return NextResponse.json({ 
      error: 'Error al consultar tracking',
      details: error.message 
    }, { status: 500 });
  }
}
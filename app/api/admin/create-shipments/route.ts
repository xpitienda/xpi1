import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(request: Request) {
  try {
    const { saleId, courierCompanyId, trackingNumber } = await request.json();

    if (!saleId || !courierCompanyId || !trackingNumber) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la venta existe
    const saleCheck = await turso.execute({
      sql: 'SELECT id FROM sales WHERE id = ?',
      args: [saleId]
    });

    if (!saleCheck.rows || saleCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    // ✅ NUEVO: Verificar si YA existe un envío para esta venta
    const existingShipment = await turso.execute({
      sql: 'SELECT id FROM shipments WHERE sale_id = ?',
      args: [saleId]
    });

    let shipmentId = null;

    if (existingShipment.rows && existingShipment.rows.length > 0) {
      // ✅ ACTUALIZAR el envío existente (Upsert)
      await turso.execute({
        sql: `UPDATE shipments 
              SET courier_company_id = ?, 
                  tracking_number = ?, 
                  status = 'En tránsito' 
              WHERE sale_id = ?`,
        args: [courierCompanyId, trackingNumber, saleId]
      });
      shipmentId = existingShipment.rows[0].id;
    } else {
      // ✅ CREAR un envío nuevo si no existe
      const result = await turso.execute({
        sql: `INSERT INTO shipments (sale_id, courier_company_id, tracking_number, status, created_at)
              VALUES (?, ?, ?, 'En tránsito', datetime('now'))`,
        args: [saleId, courierCompanyId, trackingNumber]
      });
      shipmentId = result.lastInsertRowid ? result.lastInsertRowid.toString() : null;
    }

    return NextResponse.json({
      success: true,
      shipmentId: shipmentId,
      message: existingShipment.rows && existingShipment.rows.length > 0 
        ? 'Envío actualizado correctamente' 
        : 'Envío creado correctamente'
    });
  } catch (error: any) {
    console.error('Error procesando shipment:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar el envío' },
      { status: 500 }
    );
  }
}

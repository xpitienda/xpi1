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

    // Crear el shipment
    const result = await turso.execute({
      sql: `INSERT INTO shipments (sale_id, courier_company_id, tracking_number, status, created_at)
            VALUES (?, ?, ?, 'En tránsito', datetime('now'))`,
      args: [saleId, courierCompanyId, trackingNumber]
    });

    return NextResponse.json({
      success: true,
      shipmentId: result.lastInsertRowid,
      message: 'Envío creado correctamente'
    });
  } catch (error: any) {
    console.error('Error creando shipment:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear el envío' },
      { status: 500 }
    );
  }
}
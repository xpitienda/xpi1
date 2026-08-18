// app/api/shipment/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const shipmentId = params.id;

    // Consultar el envío con información del courier
    const result = await client.execute(`
      SELECT 
        s.id,
        s.tracking_number,
        s.courier_id as courier_company_id,
        c.name as courier_name,
        c.api_endpoint
      FROM shipments s
      LEFT JOIN courier_companies c ON s.courier_id = c.id
      WHERE s.id = ?
    `, [shipmentId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    const shipment = result.rows[0] as any;

    return NextResponse.json({
      id: shipment.id,
      tracking_number: shipment.tracking_number,
      courier_company_id: shipment.courier_company_id,
      courier_name: shipment.courier_name,
      api_endpoint: shipment.api_endpoint,
    });

  } catch (error) {
    console.error('Error fetching shipment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
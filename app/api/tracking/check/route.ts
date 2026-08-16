import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function POST(req: Request) {
  try {
    const { trackingNumber, companyId } = await req.json();

    if (!trackingNumber || !companyId) {
      return NextResponse.json({ error: 'Número de guía y empresa son requeridos' }, { status: 400 });
    }

    // Obtener datos de la empresa
    const companyResult = await turso.execute({
      sql: 'SELECT id, name, code, api_endpoint FROM courier_companies WHERE id = ?',
      args: [companyId]
    });

    const company = companyResult.rows?.[0];
    if (!company) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 });
    }

    // Generar la URL de rastreo web (Opción A - URL simple)
    let trackingUrl = '';
    if (company.api_endpoint && company.api_endpoint.includes('{tracking}')) {
      trackingUrl = company.api_endpoint.replace('{tracking}', encodeURIComponent(trackingNumber));
    } else {
      return NextResponse.json({ 
        error: 'Esta empresa no tiene configurada una URL de rastreo válida',
        companyName: company.name 
      }, { status: 400 });
    }

    // Devolver la URL lista
    return NextResponse.json({
      success: true,
      companyName: company.name,
      trackingNumber: trackingNumber,
      trackingUrl: trackingUrl,
      message: 'Redirigiendo al sitio web de la transportadora...'
    });

  } catch (error) {
    console.error('Error consultando tracking:', error);
    return NextResponse.json({ error: 'Error al consultar el rastreo' }, { status: 500 });
  }
}
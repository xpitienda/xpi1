import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const result = await turso.execute('SELECT id, name, code, logo_url, api_endpoint, api_key, is_active FROM courier_companies ORDER BY name');
    return NextResponse.json(result.rows || []);
  } catch (error) {
    console.error('Error cargando empresas:', error);
    return NextResponse.json({ error: 'Error al cargar empresas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, logo_url, api_endpoint, api_key, api_secret, is_active } = body;

    await turso.execute({
      sql: `INSERT INTO courier_companies (name, code, logo_url, api_endpoint, api_key, api_secret, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [name, code, logo_url || '', api_endpoint || '', api_key || '', api_secret || '', is_active || 1]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creando empresa:', error);
    return NextResponse.json({ error: 'Error al crear empresa' }, { status: 500 });
  }
}
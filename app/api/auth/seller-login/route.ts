import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    // Buscar vendedor por email
    const result = await turso.execute({
      sql: 'SELECT * FROM sellers WHERE email = ? AND is_active = TRUE LIMIT 1',
      args: [email.toLowerCase().trim()],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const seller = result.rows[0] as any;

    // Verificar contraseña encriptada
    const isValidPassword = await bcrypt.compare(password, seller.password_hash);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    // Retornar datos del vendedor (sin la contraseña)
    return NextResponse.json({
      success: true,
      seller: {
        id: seller.id,
        full_name: seller.full_name,
        email: seller.email,
        assigned_series_id: seller.assigned_series_id,
      },
    });

  } catch (error) {
    console.error('[POST] Error seller-login:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
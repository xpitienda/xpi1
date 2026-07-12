import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Función interna para reparar la tabla si está corrupta
async function ensureTableIntegrity() {
  try {
    // Verificar si hay filas con ID NULL (corrupción)
    const nullCheck = await turso.execute("SELECT COUNT(*) as c FROM invoice_counters WHERE id IS NULL");
    const nullCount = Number((nullCheck.rows[0] as any).c);

    if (nullCount > 0) {
      console.warn('⚠️ Detectadas filas corruptas (ID NULL). Reparando tabla...');
      // Borrar todo y recrear
      await turso.execute("DROP TABLE IF EXISTS invoice_counters");
      await turso.execute(`
        CREATE TABLE invoice_counters (
          id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
          prefix_letter TEXT NOT NULL,
          city_letter TEXT NOT NULL,
          current_number INTEGER NOT NULL DEFAULT 0,
          max_number INTEGER NOT NULL DEFAULT 99999,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `);
      await turso.execute("INSERT INTO invoice_counters (prefix_letter, city_letter, current_number, is_active) VALUES ('V', 'M', 0, TRUE)");
      console.log('✅ Tabla reparada exitosamente');
    }
  } catch (e) {
    // Si la tabla no existe, crearla
    console.log('Creando tabla invoice_counters desde cero...');
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS invoice_counters (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        prefix_letter TEXT NOT NULL,
        city_letter TEXT NOT NULL,
        current_number INTEGER NOT NULL DEFAULT 0,
        max_number INTEGER NOT NULL DEFAULT 99999,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    await turso.execute("INSERT INTO invoice_counters (prefix_letter, city_letter, current_number, is_active) VALUES ('V', 'M', 0, TRUE)");
  }
}

export async function GET() {
  try {
    // Ejecutar reparación automática antes de leer
    await ensureTableIntegrity();
    
    const result = await turso.execute('SELECT * FROM invoice_counters ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[GET] Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTableIntegrity(); // Asegurar integridad también al crear
    
    const body = await request.json();
    const { prefix_letter, city_letter, start_number } = body;

    if (!prefix_letter || !city_letter) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    await turso.execute('UPDATE invoice_counters SET is_active = FALSE');
    
    await turso.execute({
      sql: 'INSERT INTO invoice_counters (prefix_letter, city_letter, current_number, is_active) VALUES (?, ?, ?, TRUE)',
      args: [String(prefix_letter).toUpperCase().trim(), String(city_letter).toUpperCase().trim(), Number(start_number) || 0],
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST] Error:', error);
    return NextResponse.json({ error: 'Error al activar serie' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: 'DELETE FROM invoice_counters WHERE id = ?',
      args: [String(id)],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: 'Serie no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE] Error:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
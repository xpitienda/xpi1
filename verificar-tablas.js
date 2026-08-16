require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function verificarYCrearTablas() {
  try {
    console.log('🔍 Conectando a Turso...\n');

    // 1. Ver qué tablas existen
    const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table'");
    const existingTables = tables.rows.map(r => r.name);
    console.log('📋 Tablas existentes:', existingTables.join(', ') || 'NINGUNA');
    console.log('');

    // 2. Crear tabla banners si no existe
    if (!existingTables.includes('banners')) {
      console.log('🔨 Creando tabla banners...');
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS banners (
          id TEXT PRIMARY KEY,
          text TEXT NOT NULL,
          type TEXT DEFAULT 'rolling',
          background_color TEXT DEFAULT '#3D1A78',
          text_color TEXT DEFAULT '#ffffff',
          link_url TEXT,
          display_order INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla banners creada');
    } else {
      console.log('✅ Tabla banners ya existe');
    }

    // 3. Crear tabla advanced_banners si no existe
    if (!existingTables.includes('advanced_banners')) {
      console.log('🔨 Creando tabla advanced_banners...');
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS advanced_banners (
          id TEXT PRIMARY KEY,
          title TEXT,
          image_url TEXT NOT NULL,
          link_url TEXT,
          start_date TEXT,
          end_date TEXT,
          display_order INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla advanced_banners creada');
    } else {
      console.log('✅ Tabla advanced_banners ya existe');
    }

    // 4. Crear tabla stickers si no existe
    if (!existingTables.includes('stickers')) {
      console.log('🔨 Creando tabla stickers...');
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS stickers (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          message TEXT NOT NULL,
          points INTEGER DEFAULT 5,
          color_start TEXT DEFAULT '#FF0000',
          color_end TEXT DEFAULT '#FFFF00',
          text_color TEXT DEFAULT '#000000',
          start_date TEXT,
          end_date TEXT,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla stickers creada');
    } else {
      console.log('✅ Tabla stickers ya existe');
    }

    // 5. Verificar resultado final
    const finalTables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('\n🎉 Tablas finales en Turso:');
    finalTables.rows.forEach(r => console.log('   -', r.name));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await turso.close();
  }
}

verificarYCrearTablas();
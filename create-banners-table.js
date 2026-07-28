require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createBannersTable() {
  try {
    console.log('Creando tabla de banners...');
    
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS banners (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        type TEXT DEFAULT 'rolling',
        background_color TEXT DEFAULT '#3D1A78',
        text_color TEXT DEFAULT '#ffffff',
        is_active INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        link_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabla de banners creada correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await turso.close();
}

createBannersTable();

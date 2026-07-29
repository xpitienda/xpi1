require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createAdvancedBannersTable() {
  try {
    console.log('Creando tabla de banners avanzados...');
    
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS advanced_banners (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        link_url TEXT,
        start_date TEXT,
        end_date TEXT,
        is_active INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabla advanced_banners creada correctamente.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await turso.close();
}

createAdvancedBannersTable();

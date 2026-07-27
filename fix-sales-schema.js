require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function fixSchema() {
  try {
    console.log('Actualizando esquema de la tabla sales...');
    
    // Intentar agregar las columnas. Si ya existen, el catch lo ignorará.
    try { await turso.execute('ALTER TABLE sales ADD COLUMN seller_id TEXT'); } catch(e) {}
    try { await turso.execute('ALTER TABLE sales ADD COLUMN series_id TEXT'); } catch(e) {}
    
    console.log('✅ Columnas agregadas o ya existentes.');
    
    // Verificar estructura final
    const info = await turso.execute('PRAGMA table_info(sales)');
    console.log('Columnas actuales de la tabla sales:', info.rows.map(r => r.name).join(', '));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await turso.close();
}

fixSchema();

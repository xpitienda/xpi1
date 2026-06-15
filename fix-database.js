const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function fixDatabase() {
  try {
    console.log('=== AGREGANDO COLUMNAS FALTANTES ===');
    
    // Agregar is_featured
    await turso.execute('ALTER TABLE catalog ADD COLUMN is_featured INTEGER DEFAULT 0');
    console.log('✓ Columna is_featured agregada');
    
    // Agregar offer_type
    await turso.execute('ALTER TABLE catalog ADD COLUMN offer_type TEXT');
    console.log('✓ Columna offer_type agregada');
    
    // Agregar offer_price
    await turso.execute('ALTER TABLE catalog ADD COLUMN offer_price REAL');
    console.log('✓ Columna offer_price agregada');
    
    console.log('\\n=== VERIFICANDO ===');
    const result = await turso.execute('PRAGMA table_info(catalog)');
    console.log('Columnas actuales:', result.rows.map(r => r.name).join(', '));
    
    console.log('\\n✅ Base de datos actualizada correctamente');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixDatabase();

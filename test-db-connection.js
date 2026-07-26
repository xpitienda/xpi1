require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function testDB() {
  try {
    console.log('🔌 Conectando a Turso...');
    
    // Verificar conexión
    const result = await turso.execute("SELECT 1 as test");
    console.log('✅ Conexión exitosa:', result.rows[0]);
    
    // Verificar tabla catalog
    const catalog = await turso.execute("SELECT COUNT(*) as count FROM catalog");
    console.log('✅ Tabla catalog existe. Productos:', catalog.rows[0].count);
    
    // Verificar estructura
    const schema = await turso.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='catalog'");
    console.log('\n📋 Estructura de catalog:');
    console.log(schema.rows[0].sql);
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\n Posibles causas:');
    console.log('1. Variables de entorno incorrectas');
    console.log('2. Base de datos no existe');
    console.log('3. Token de autenticación inválido');
  } finally {
    await turso.close();
  }
}

testDB();

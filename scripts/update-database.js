const { createClient } = require('@libsql/client');

const turso = createClient({
  url: 'libsql://xpitiendacatalog-xpitiendas.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzkwNjg1NTQsImlkIjoiMDE5ZTM4YmMtYWEwMS03M2JhLThhY2MtNmU5MjRkZTk0MTA4IiwicmlkIjoiNjg1ZGE0YmEtNWY1Ny00NGFkLWE3MTAtNjI5NTY3NDljYjkyIn0.spCX8K7W3ptEx4ZZD9RRkuzvHF0tg4Zxwg9HBG2g6q9l0i-uuPUfH_Gy1-VmgWM5r47VYMd8HneVO3z2g6zuAA'
});

async function updateSchema() {
  try {
    console.log('🔄 Actualizando esquema de base de datos...');
    
    // Intentar agregar columnas (puede fallar si ya existen, lo cual está bien)
    try {
      await turso.execute('ALTER TABLE catalog ADD COLUMN original_price REAL');
      console.log('✅ Columna original_price agregada');
    } catch (e) {
      console.log('ℹ️  Columna original_price ya existe');
    }
    
    try {
      await turso.execute('ALTER TABLE catalog ADD COLUMN on_sale INTEGER DEFAULT 0');
      console.log('✅ Columna on_sale agregada');
    } catch (e) {
      console.log('ℹ️  Columna on_sale ya existe');
    }
    
    try {
      await turso.execute('ALTER TABLE catalog ADD COLUMN sale_price REAL');
      console.log('✅ Columna sale_price agregada');
    } catch (e) {
      console.log('ℹ️  Columna sale_price ya existe');
    }
    
    // Verificar estructura
    const result = await turso.execute('PRAGMA table_info(catalog)');
    console.log('\n📋 Estructura actual de catalog:');
    console.table(result.rows);
    
    // Ver productos existentes
    const products = await turso.execute('SELECT id, name, price, original_price, on_sale, sale_price FROM catalog LIMIT 5');
    console.log('\n📦 Productos existentes:');
    console.table(products.rows);
    
    console.log('\n✅ Base de datos actualizada correctamente');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await turso.close();
  }
}

updateSchema();
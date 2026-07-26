require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createMissingTables() {
  console.log('CREANDO TABLAS FALTANTES...\n');

  const queries = [
    "CREATE TABLE IF NOT EXISTS sales (id TEXT PRIMARY KEY, seller_id TEXT, total_amount REAL NOT NULL, status TEXT DEFAULT 'completed', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (seller_id) REFERENCES sellers(id))",
    
    "CREATE TABLE IF NOT EXISTS sale_items (id TEXT PRIMARY KEY, sale_id TEXT NOT NULL, product_id TEXT NOT NULL, quantity INTEGER NOT NULL, unit_price REAL NOT NULL, subtotal REAL NOT NULL, FOREIGN KEY (sale_id) REFERENCES sales(id), FOREIGN KEY (product_id) REFERENCES catalog(id))",
    
    "CREATE TABLE IF NOT EXISTS invoices (id TEXT PRIMARY KEY, sale_id TEXT NOT NULL, invoice_number TEXT NOT NULL UNIQUE, customer_name TEXT, customer_email TEXT, customer_phone TEXT, total_amount REAL NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (sale_id) REFERENCES sales(id))"
  ];

  for (const query of queries) {
    try {
      const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
      await turso.execute(query);
      console.log('✅ Tabla creada exitosamente: ' + tableName);
    } catch (error) {
      console.error('❌ Error creando tabla: ' + error.message);
    }
  }

  console.log('\nPROCESO COMPLETADO. Todas las tablas necesarias estan listas.');
  
  const tables = await turso.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('\nTablas finales en la base de datos:');
  tables.rows.forEach(t => console.log('  - ' + t.name));

  await turso.close();
}

createMissingTables();

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function fixTables() {
  try {
    console.log('Recreando tablas de ventas con el esquema correcto...');
    
    // 1. Borrar tablas antiguas (si existen)
    await turso.execute('DROP TABLE IF EXISTS voided_sales');
    await turso.execute('DROP TABLE IF EXISTS sales');
    
    // 2. Crear tabla de ventas con TODAS las columnas necesarias
    await turso.execute(`
      CREATE TABLE sales (
        id TEXT PRIMARY KEY,
        invoice_number TEXT NOT NULL,
        seller_name TEXT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT,
        items TEXT NOT NULL,
        total_amount REAL NOT NULL,
        sale_type TEXT DEFAULT 'cart',
        status TEXT DEFAULT 'Pendiente',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 3. Crear tabla de ventas anuladas
    await turso.execute(`
      CREATE TABLE voided_sales (
        sale_id TEXT PRIMARY KEY,
        reason TEXT,
        voided_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sale_id) REFERENCES sales(id)
      )
    `);
    
    console.log('✅ Tablas de ventas recreadas correctamente.');
    
    // 4. Verificar que la columna 'items' exista
    const check = await turso.execute('PRAGMA table_info(sales)');
    const columns = check.rows.map(r => r.name).join(', ');
    console.log('Columnas de la tabla sales:', columns);
    
  } catch (error) {
    console.error('❌ Error recreando tablas:', error.message);
  }
  
  await turso.close();
}

fixTables();

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createTables() {
  try {
    console.log('Creando tablas de ventas...');
    
    // Tabla de ventas
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS sales (
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
    
    // Tabla de ventas anuladas
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS voided_sales (
        sale_id TEXT PRIMARY KEY,
        reason TEXT,
        voided_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sale_id) REFERENCES sales(id)
      )
    `);
    
    console.log('✅ Tablas de ventas creadas correctamente');
    
    // Verificar
    const checkSales = await turso.execute('SELECT COUNT(*) as count FROM sales');
    const checkVoided = await turso.execute('SELECT COUNT(*) as count FROM voided_sales');
    
    console.log('Ventas registradas:', checkSales.rows[0].count);
    console.log('Ventas anuladas:', checkVoided.rows[0].count);
    
  } catch (error) {
    console.error('Error creando tablas:', error.message);
  }
  
  await turso.close();
}

createTables();

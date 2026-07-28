require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function deleteTestData() {
  try {
    console.log('Eliminando datos de prueba...');
    
    // 1. Eliminar ventas de prueba (por número de factura)
    const testInvoices = ['F-001-WEB', 'F-002-VEND', 'F-003-VEND'];
    
    for (const invoice of testInvoices) {
      await turso.execute({
        sql: 'DELETE FROM sales WHERE invoice_number = ?',
        args: [invoice]
      });
      console.log(`✅ Venta ${invoice} eliminada`);
    }
    
    // 2. Eliminar vendedores de prueba (si existen en la tabla sellers)
    try {
      const testSellers = ['Vendedor 1', 'Vendedor 2'];
      
      for (const sellerName of testSellers) {
        const result = await turso.execute({
          sql: 'DELETE FROM sellers WHERE full_name = ?',
          args: [sellerName]
        });
        
        if (result.rowsAffected > 0) {
          console.log(`✅ Vendedor "${sellerName}" eliminado`);
        }
      }
    } catch (err) {
      console.log('️ Tabla sellers no existe o no hay vendedores de prueba');
    }
    
    // 3. Verificar cuántas ventas quedan
    const count = await turso.execute('SELECT COUNT(*) as count FROM sales');
    console.log(`\n📊 Ventas restantes en la base de datos: ${count.rows[0].count}`);
    
    console.log('\n✅ Datos de prueba eliminados correctamente');
    
  } catch (error) {
    console.error('❌ Error eliminando datos:', error.message);
  }
  
  await turso.close();
}

deleteTestData();

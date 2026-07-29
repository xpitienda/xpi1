require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkSaleStructure() {
  try {
    const result = await turso.execute('SELECT * FROM sales LIMIT 1');
    if (result.rows.length > 0) {
      console.log('Estructura de una venta:');
      console.log(Object.keys(result.rows[0]));
      console.log('Detalle de la primera venta:');
      console.log(result.rows[0]);
    } else {
      console.log('No hay ventas en la base de datos.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  await turso.close();
}

checkSaleStructure();

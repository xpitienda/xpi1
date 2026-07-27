require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkData() {
  try {
    const sales = await turso.execute('SELECT COUNT(*) as count FROM sales');
    console.log('Ventas en BD:', sales.rows[0].count);
    
    if (sales.rows[0].count > 0) {
      const sample = await turso.execute('SELECT * FROM sales LIMIT 3');
      console.log('Muestras:', sample.rows);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await turso.close();
}

checkData();

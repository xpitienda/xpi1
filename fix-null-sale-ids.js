require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const { randomUUID } = require('crypto');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function fixNullIds() {
  try {
    const result = await turso.execute('SELECT invoice_number FROM sales WHERE id IS NULL');
    if (result.rows.length === 0) {
      console.log('✅ No hay ventas con id nulo. Todo está correcto.');
    } else {
      for (const row of result.rows) {
        const newId = randomUUID();
        await turso.execute({
          sql: 'UPDATE sales SET id = ? WHERE invoice_number = ?',
          args: [newId, row.invoice_number]
        });
        console.log(`✅ Corregido: ${row.invoice_number} -> ID: ${newId}`);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  await turso.close();
}

fixNullIds();

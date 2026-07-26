require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkTables() {
  console.log('📊 ESQUEMA DE TABLAS EXISTENTES:\n');
  
  const importantTables = ['catalog', 'categories', 'sellers', 'invoice_counters'];
  
  for (const tableName of importantTables) {
    try {
      const schema = await turso.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='" + tableName + "'");
      if (schema.rows.length > 0) {
        console.log('✅ ' + tableName + ':');
        console.log(schema.rows[0].sql);
        console.log('');
      } else {
        console.log('❌ ' + tableName + ': NO EXISTE');
        console.log('');
      }
    } catch (err) {
      console.log('⚠️  ' + tableName + ': Error - ' + err.message);
    }
  }
  
  await turso.close();
}

checkTables();

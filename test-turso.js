const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function test() {
  try {
    const result = await turso.execute('PRAGMA table_info(catalog)');
    console.log('=== COLUMNAS DE CATALOG ===');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();

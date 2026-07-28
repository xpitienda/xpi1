require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkTable() {
  try {
    const result = await turso.execute("PRAGMA table_info(banners)");
    if (result.rows.length > 0) {
      console.log("✅ Tabla 'banners' existe. Columnas:", result.rows.map(r => r.name).join(', '));
    } else {
      console.log("❌ Tabla 'banners' no existe o está vacía.");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
  await turso.close();
}
checkTable();

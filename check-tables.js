const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:dev.db' });
(async () => {
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
  console.log('Tablas encontradas en dev.db:');
  tables.rows.forEach(t => console.log('  -', t.name));
  await db.close();
})();

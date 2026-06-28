const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:dev.db' });
(async () => {
  const info = await db.execute("PRAGMA table_info(catalog);");
  console.log('Columnas de la tabla catalog:');
  info.rows.forEach(col => console.log(`  - ${col.name} (${col.type})`));
  
  const count = await db.execute("SELECT COUNT(*) as total FROM catalog;");
  console.log(`\nTotal de registros: ${count.rows[0].total}`);
  
  const sample = await db.execute("SELECT * FROM catalog LIMIT 2;");
  console.log('\nEjemplo de registros:');
  console.log(JSON.stringify(sample.rows, null, 2));
  
  await db.close();
})();

import { turso } from './lib/turso.js';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    const sqlPath = path.join(process.cwd(), 'scripts', 'migrate-categories.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    console.log('📦 Ejecutando migración de categorías...');
    
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await turso.execute(statement);
        console.log('✅ Ejecutado');
      }
    }
    
    console.log('✅ Migración completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

runMigration();

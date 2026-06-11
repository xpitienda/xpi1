import { createClient } from '@libsql/client';
import path from 'path';

// Verificar si hay configuración de Turso en la nube
const isTursoConfigured = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

// Si está configurado Turso, usarlo; si no, usar SQLite local
export const turso = isTursoConfigured
  ? createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  : createClient({
      url: process.env.DATABASE_URL || 'file:./dev.db',
    });

// Función para inicializar la base de datos
export async function initDatabase() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS catalog (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        category TEXT DEFAULT 'General',
        stock INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        on_sale INTEGER DEFAULT 0,
        sale_price REAL,
        original_price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
}

export { isTursoConfigured };
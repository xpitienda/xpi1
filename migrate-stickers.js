const { turso } = require('./lib/turso');

async function createStickersTable() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS stickers (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        message TEXT NOT NULL,
        points INTEGER DEFAULT 6,
        color_start TEXT DEFAULT '#FF006E',
        color_end TEXT DEFAULT '#FFBE0B',
        text_color TEXT DEFAULT '#FFFFFF',
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (product_id) REFERENCES catalog(id)
      )
    `);
    console.log('✅ Tabla stickers creada exitosamente.');
  } catch (error) {
    console.error('❌ Error creando tabla stickers:', error);
  }
}

createStickersTable();

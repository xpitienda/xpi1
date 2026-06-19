-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insertar categorías por defecto
INSERT OR IGNORE INTO categories (id, name, parent_id) VALUES 
  ('cat_general', 'General', NULL),
  ('cat_ropa', 'Ropa', NULL),
  ('cat_tecnologia', 'Tecnologia', NULL),
  ('cat_hogar', 'Hogar', NULL),
  ('cat_deportes', 'Deportes', NULL),
  ('cat_accesorios', 'Accesorios', NULL);

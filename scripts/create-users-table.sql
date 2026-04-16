-- Create users table for login
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default demo user (password: demo1234)
-- The hash below is bcrypt of "demo1234"
INSERT INTO users (email, password_hash, name)
VALUES (
  'demo@tienda.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Usuario Demo'
)
ON CONFLICT (email) DO NOTHING;

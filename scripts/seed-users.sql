-- Insert demo users for testing login
INSERT INTO users (email, password_hash, name) VALUES
  ('demo@example.com', 'demo@example.com', 'Demo User'),
  ('test@example.com', 'test@example.com', 'Test User'),
  ('user@example.com', 'user@example.com', 'Example User')
ON CONFLICT (email) DO NOTHING;

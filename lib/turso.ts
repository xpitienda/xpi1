// lib/turso.ts
import { createClient, Client } from '@libsql/client';

// Create a mock client that returns empty results
const mockClient = {
  execute: async () => ({ rows: [], columns: [], rowsAffected: 0, lastInsertRowid: 0n }),
  batch: async () => [],
  transaction: async () => ({ execute: async () => ({ rows: [], columns: [], rowsAffected: 0, lastInsertRowid: 0n }), commit: async () => {}, rollback: async () => {}, close: () => {} }),
  close: () => {},
} as unknown as Client;

// Only create real client if env vars are present
export const turso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : mockClient;

export const isTursoConfigured = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

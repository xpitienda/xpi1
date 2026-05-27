// lib/turso.ts
import { createClient } from '@libsql/client';

export const isTursoConfigured = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

export const turso = isTursoConfigured 
  ? createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  : {
      execute: async () => ({ rows: [] }),
    };

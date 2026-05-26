// lib/r2.ts
import { S3Client } from '@aws-sdk/client-s3';

// Verificar variables de entorno
if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error('Faltan variables de entorno de R2');
}

// Cliente S3 para interactuar con R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Nombre del bucket
export const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';

// URL pública de desarrollo de Cloudflare R2
const PUBLIC_URL = 'https://pub-aa262763875e4dc4ab1d8c212bad2fa0.r2.dev';

// Función para generar URL pública de una imagen
export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}

// Función para obtener la URL base del endpoint
export function getEndpoint(): string {
  return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
}
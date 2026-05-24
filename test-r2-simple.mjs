// test-r2-simple.mjs
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://935deb1e9393f654993f31d242b3bed8.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'TU_NUEVO_ACCESS_KEY',
    secretAccessKey: 'TU_NUEVO_SECRET_KEY',
  },
});

try {
  console.log('🔍 Conectando a R2...');
  const result = await client.send(new ListBucketsCommand({}));
  console.log('✅ Éxito! Buckets:', result.Buckets);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Code:', error.code);
}
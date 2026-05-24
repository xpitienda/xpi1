import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://935deb1e9393f654993f31d242b3bed8.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '1a4cb6695dcf93932899a0d65d187acc',
    secretAccessKey: 'ca3a2b08683e4dbb0d4a8f95b69d2eed577527285e3c0515c90287d27b102f6f',
  },
});

try {
  const result = await client.send(new ListBucketsCommand({}));
  console.log('✅ Conexión exitosa:', result.Buckets);
} catch (error) {
  console.error('❌ Error:', error.message);
}

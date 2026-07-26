require('dotenv').config({ path: '.env.local' });
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: 'auto',
  endpoint: 'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function testR2() {
  try {
    console.log('🔌 Probando conexión a R2...');
    console.log('   Bucket:', process.env.R2_BUCKET_NAME);
    console.log('   Account ID:', process.env.R2_ACCOUNT_ID);
    
    const result = await s3Client.send(new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      MaxKeys: 1
    }));
    
    console.log('✅ Conexión exitosa a R2');
    console.log('   Imágenes en el bucket:', result.KeyCount || 0);
    
  } catch (error) {
    console.error('❌ Error conectando a R2:', error.message);
    console.error('   Verifica que:');
    console.error('   1. El bucket existe');
    console.error('   2. Las credenciales son correctas');
    console.error('   3. Tienes permisos de escritura');
  }
}

testR2();

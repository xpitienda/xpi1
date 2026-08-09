import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function testR2() {
  try {
    console.log('📡 Conectando a R2...');
    console.log('Bucket:', process.env.R2_BUCKET_NAME);
    
    const result = await R2.send(new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME || 'xpitienda-images',
      Prefix: 'backups/'
    }));
    
    console.log('✅ Conexión exitosa');
    console.log('Archivos en backups/:', result.Contents ? result.Contents.length : 0);
    
    if (result.Contents && result.Contents.length > 0) {
      result.Contents.forEach(obj => {
        console.log('  - ' + obj.Key + ' (' + obj.Size + ' bytes)');
      });
    } else {
      console.log('⚠️ No hay archivos en la carpeta backups/');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testR2();

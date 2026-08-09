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

async function listAll() {
  try {
    console.log('📋 Listando TODO el bucket...');
    
    const result = await R2.send(new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME || 'xpitienda-images',
      MaxKeys: 20
    }));
    
    console.log('Total de objetos:', result.KeyCount);
    console.log('\nPrimeros 20 objetos:');
    
    if (result.Contents) {
      result.Contents.forEach((obj, index) => {
        console.log(`${index + 1}. ${obj.Key} (${obj.Size} bytes)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listAll();

// test-r2-upload-ssl.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

async function testUpload() {
  console.log('🔧 Configuración:');
  console.log('Account ID:', process.env.R2_ACCOUNT_ID);
  console.log('Bucket:', process.env.R2_BUCKET_NAME);
  
  // Agente HTTPS que ignora SSL
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  });

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    requestHandler: {
      handler: httpsAgent,
    },
  });

  const testBuffer = Buffer.from('test content - ' + Date.now());
  
  try {
    console.log('\n📤 Subiendo archivo de prueba...');
    
    await client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'test-ssl.txt',
      Body: testBuffer,
    }));
    
    console.log('\n✅ Upload exitoso!');
    console.log(`URL: ${process.env.R2_PUBLIC_URL}/test-ssl.txt`);
  } catch (error) {
    console.error('\n Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testUpload();
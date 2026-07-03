import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { v4 as uuidv4 } from 'uuid';
import * as https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID!, secretAccessKey: R2_SECRET_ACCESS_KEY! },
      requestHandler: new NodeHttpHandler({ httpsAgent }),
    });

    const urls = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop();
      const key = `products/${uuidv4()}.${ext}`;

      await client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME, Key: key, Body: buffer, ContentType: file.type,
      }));

      urls.push({
        originalName: file.name,
        url: `https://pub-aa262763875e4dc4ab1d8c212bad2fa0.r2.dev/${key}`
      });
    }

    return NextResponse.json({ success: true, count: urls.length, urls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

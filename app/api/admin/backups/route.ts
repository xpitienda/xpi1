// app/api/admin/backups/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'xpitienda-images';

export async function GET() {
  try {
    const result = await R2.send(new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'backups/',
    }));

    const backups = result.Contents?.map(obj => ({
      key: obj.Key,
      name: obj.Key?.replace('backups/', ''),
      size: obj.Size,
      lastModified: obj.LastModified,
    })) || [];

    return NextResponse.json(backups);
  } catch (error: any) {
    console.error('Error listanto backups:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key requerida' }, { status: 400 });
    }

    await R2.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));

    return NextResponse.json({ success: true, message: 'Backup eliminado' });
  } catch (error: any) {
    console.error('Error eliminando backup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
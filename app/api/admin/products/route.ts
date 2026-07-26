import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM catalog ORDER BY name ASC');
    return NextResponse.json(result.rows || []);
  } catch (error: any) {
    console.error('Error cargando productos:', error);
    return NextResponse.json({ error: 'Error al cargar productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any;
    let image_url: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('image');

      // Verificar que sea un File antes de acceder a sus propiedades
      if (file && file instanceof File && file.size > 0) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const fileName = `${randomUUID()}-${cleanName}`;

        await s3Client.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: fileName,
          Body: fileBuffer,
          ContentType: file.type,
        }));

        const baseUrl = process.env.R2_PUBLIC_URL!.startsWith('http')
          ? process.env.R2_PUBLIC_URL
          : `https://${process.env.R2_PUBLIC_URL}`;
        image_url = `${baseUrl}/${fileName}`;
      }

      body = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
        is_active: formData.get('is_active'),
      };
    } else {
      body = await request.json();
      image_url = body.image_url || null;
    }

    const { name, description, price, stock, category, is_active } = body;

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y stock son requeridos' }, { status: 400 });
    }

    const newId = randomUUID();
    await turso.execute({
      sql: "INSERT INTO catalog (id, name, description, price, stock, category, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [
        newId,
        name,
        description || null,
        Number(price),
        Number(stock),
        category || null,
        image_url,
        is_active !== undefined ? Number(is_active) : 1
      ]
    });

    return NextResponse.json({
      id: newId,
      name,
      description: description || null,
      price: Number(price),
      stock: Number(stock),
      category: category || null,
      image_url,
      is_active: is_active !== undefined ? Number(is_active) : 1
    });

  } catch (error: any) {
    console.error('Error creando producto:', error);
    return NextResponse.json({ error: 'Error al crear producto: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || id.trim() === '') {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await turso.execute({
      sql: 'DELETE FROM catalog WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true, message: 'Producto eliminado' });
  } catch (error: any) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json({ error: 'Error al eliminar: ' + error.message }, { status: 500 });
  }
}
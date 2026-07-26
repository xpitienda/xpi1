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
    console.log('📥 POST /api/admin/products - Headers:', Object.fromEntries(request.headers));
    
    const contentType = request.headers.get('content-type') || '';
    let body;
    let image_url = null;

    if (contentType.includes('multipart/form-data')) {
      console.log('📁 Recibiendo FormData con archivo');
      const formData = await request.formData();
      
      body = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
        is_active: formData.get('is_active'),
      };

      const file = formData.get('image');
      console.log('📄 Archivo recibido:', file ? file.name : 'Ninguno');

      if (file && file instanceof File && file.size > 0) {
        try {
          console.log('🚀 Subiendo a R2...');
          console.log('   Bucket:', process.env.R2_BUCKET_NAME);
          console.log('   Account ID:', process.env.R2_ACCOUNT_ID ? 'Configurado' : 'NO CONFIGURADO');
          
          const fileBuffer = Buffer.from(await file.arrayBuffer());
          const fileName = `${randomUUID()}-${file.name}`;
          
          await s3Client.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type,
          }));

          image_url = `https://${process.env.R2_PUBLIC_URL}/${fileName}`;
          console.log('✅ Imagen subida:', image_url);
        } catch (uploadError: any) {
          console.error('❌ ERROR SUBIENDO A R2:', uploadError.message);
          console.error('   Detalles:', uploadError);
          // Continuamos sin imagen en lugar de fallar
          image_url = null;
        }
      }
    } else {
      console.log('📝 Recibiendo JSON');
      body = await request.json();
      image_url = body.image_url || null;
    }

    const { name, description, price, stock, category, is_active } = body;
    
    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Nombre, precio y stock son requeridos' }, { status: 400 });
    }

    const newId = randomUUID();
    await turso.execute({
      sql: `INSERT INTO catalog (id, name, description, price, stock, category, image_url, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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

    console.log('✅ Producto creado:', name, 'ID:', newId);
    return NextResponse.json({
      id: newId,
      name,
      price: Number(price),
      stock: Number(stock),
      image_url
    });

  } catch (error: any) {
    console.error('❌ ERROR EN POST:', error);
    return NextResponse.json({ error: 'Error: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('🗑️ DELETE /api/admin/products - ID recibido:', id);
    console.log('   URL completa:', request.url);

    if (!id || id.trim() === '') {
      console.error('❌ No se recibió ID válido');
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    // Verificar que existe
    const checkResult = await turso.execute({
      sql: 'SELECT id, name FROM catalog WHERE id = ?',
      args: [id]
    });

    console.log(' Producto encontrado:', checkResult.rows.length, 'registros');

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Eliminar
    await turso.execute({
      sql: 'DELETE FROM catalog WHERE id = ?',
      args: [id]
    });

    console.log('✅ Producto eliminado de la BD');

    // Verificar que se eliminó
    const verifyResult = await turso.execute({
      sql: 'SELECT COUNT(*) as count FROM catalog WHERE id = ?',
      args: [id]
    });

    console.log('🔍 Verificación post-eliminación:', verifyResult.rows[0].count, 'registros');

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('❌ ERROR EN DELETE:', error);
    return NextResponse.json({ error: 'Error: ' + error.message }, { status: 500 });
  }
}

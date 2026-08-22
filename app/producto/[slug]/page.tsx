import { notFound } from 'next/navigation';
import { turso } from '@/lib/turso';
import ProductImageCarousel from '@/app/(shop)/catalog/components/ProductImageCarousel';

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
}

// Función para obtener el producto por slug
async function getProductBySlug(slug: string) {
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM catalog WHERE LOWER(REPLACE(name, " ", "-")) = ? OR id = ?',
      args: [slug, slug]
    });
    return result.rows?.[0] || null;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return null;
  }
}

// Función para obtener imágenes adicionales del producto
async function getProductImages(productId: string): Promise<ProductImage[]> {
  try {
    const result = await turso.execute({
      sql: 'SELECT id, product_id, image_url, display_order FROM product_images WHERE product_id = ? ORDER BY display_order ASC',
      args: [productId]
    });
    
    // Mapear explícitamente las filas al tipo ProductImage
    return (result.rows || []).map((row: any) => ({
      id: Number(row.id),
      product_id: Number(row.product_id),
      image_url: String(row.image_url),
      display_order: Number(row.display_order)
    }));
  } catch (error) {
    console.error('Error obteniendo imágenes:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const additionalImages = await getProductImages(String(product.id));

  // Convertir valores de la BD a strings explícitamente
  const productName = String(product.name || '');
  const productCategory = String(product.category || 'Producto');
  const productDescription = String(product.description || '');
  const productPrice = Number(product.price || 0);
  const productStock = Number(product.stock || 0);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #FDF6E3, #FFECD2, #FDF6E3)',
      paddingBottom: '4rem'
    }}>
      {/* Header simple */}
      <div style={{
        background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
        color: 'white',
        padding: '2rem 1rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <a 
            href="/catalog" 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              fontWeight: '600'
            }}
          >
            ← Volver al catálogo
          </a>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {productName}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            {productCategory}
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Carrusel 3D */}
        <div style={{ 
          background: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <ProductImageCarousel
            images={additionalImages}
            productName={productName}
            price={productPrice}
            description={productDescription}
            onClose={() => {}}
            showCloseButton={false}
          />
        </div>

        {/* Información adicional */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Precio */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Precio</p>
            <p style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: '#16a34a',
              marginBottom: '1rem'
            }}>
              ${productPrice.toLocaleString('es-CO')}
            </p>
            {productStock > 0 ? (
              <p style={{ color: '#16a34a', fontWeight: '600' }}>
                ✅ Stock: {productStock} unidades
              </p>
            ) : (
              <p style={{ color: '#dc2626', fontWeight: '600' }}>
                 Agotado
              </p>
            )}
          </div>

          {/* Descripción */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            gridColumn: 'span 2'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
              Descripción del Producto
            </h3>
            <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
              {productDescription || 'Sin descripción disponible'}
            </p>
          </div>
        </div>

        {/* Botón de WhatsApp */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a
            href={`https://wa.me/573234475311?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(productName)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem 2.5rem',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '9999px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 10px 30px rgba(37, 211, 102, 0.3)',
              transition: 'transform 0.3s ease'
            }}
          >
            💬 Consultar por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
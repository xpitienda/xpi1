import { MetadataRoute } from 'next';
import { turso } from '@/lib/turso';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://xpi1-tienda.vercel.app';

  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vender`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Obtener productos de la base de datos para URLs dinámicas
  let productPages: MetadataRoute.Sitemap = [];
  
  try {
    const result = await turso.execute(`
      SELECT id, name, updated_at 
      FROM catalog 
      WHERE is_active = 1
      ORDER BY updated_at DESC
    `);

    productPages = (result.rows || []).map((product: any) => ({
      url: `${baseUrl}/catalog?q=${encodeURIComponent(product.name)}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap for products:', error);
  }

  // Combinar todas las páginas
  return [...staticPages, ...productPages];
}
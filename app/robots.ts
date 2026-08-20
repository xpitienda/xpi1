import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/tracking/'],
    },
    sitemap: 'https://xpi1-tienda.vercel.app/sitemap.xml',
  };
}
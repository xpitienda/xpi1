/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir uploads grandes
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },

  // Configurar dominios permitidos para imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-aa262763875e4dc4ab1d8c212bad2fa0.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 🔒 HEADERS DE SEGURIDAD (Capa 1 - Escudo Invisible)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevenir clickjacking (que otros sitios incrusten tu tienda en iframes)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevenir MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Política de referer estricta
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Deshabilitar acceso a características del navegador sin permiso
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Forzar HTTPS (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Prevenir XSS (Cross-Site Scripting)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
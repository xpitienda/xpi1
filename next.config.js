/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir uploads grandes (hasta 100MB)
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
        pathname: '/productos/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Headers CORS para APIs
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
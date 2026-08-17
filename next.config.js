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
};

module.exports = nextConfig;
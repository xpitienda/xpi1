/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ignorar errores de TypeScript en build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorar errores de ESLint en build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;

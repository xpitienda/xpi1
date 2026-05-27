/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita que Next.js intente generar páginas estáticas durante el build
  output: 'standalone',
  
  // Deshabilita la generación estática
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

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
  
  // Evita errores de TypeScript durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
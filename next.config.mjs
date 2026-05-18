/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Force rebuild
  generateBuildId: async () => `build-${Date.now()}`,
}

export default nextConfig

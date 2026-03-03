import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@aircraft/ui', '@aircraft/design-tokens', '@aircraft/shared-types'],
}

export default nextConfig

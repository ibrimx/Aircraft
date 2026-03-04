import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@aircraft/shared-types',
    '@aircraft/design-tokens',
    '@aircraft/builder-engine',
    '@aircraft/ui',
    '@aircraft/fabric-adapter',
    '@aircraft/state-bridge',
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      canvas: false,
      jsdom: false,
      fabric: false,
      ...(isServer
        ? {
            '@aircraft/fabric-adapter/canvas': path.resolve(
              process.cwd(),
              'src/shims/fabric-canvas.tsx'
            ),
          }
        : {}),
    }
    return config
  },
}

export default nextConfig

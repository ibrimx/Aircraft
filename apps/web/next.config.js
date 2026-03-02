/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@aircraft/ui',
    '@aircraft/design-tokens',
    '@aircraft/shared-types'
  ]
};
module.exports = nextConfig;

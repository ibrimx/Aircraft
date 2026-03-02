/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@aircraft/ui',
    '@aircraft/design-tokens',
    '@aircraft/shared-types'
  ]
};

module.exports = nextConfig;

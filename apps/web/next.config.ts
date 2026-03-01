import type { NextConfig } from 'next'

// Required for @cloudflare/next-on-pages
// All pages must export: export const runtime = 'edge'
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
}

export default nextConfig

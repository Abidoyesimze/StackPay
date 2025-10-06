/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@stackspay/ui', '@stackspay/utils', '@stackspay/sdk', '@stackspay/widget'],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

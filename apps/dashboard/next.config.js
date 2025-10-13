/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@stackspay/ui', '@stackspay/utils', '@stackspay/sdk', '@stackspay/widget'],
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',       // <- clave para Cloud Run
  reactStrictMode: true,
  experimental: {},           // sin `appDir` ni flags raros
};
module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Cloud Run
  reactStrictMode: true,
  images: {
    // Se irán agregando dominios reales de CDN/imágenes en etapas posteriores.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

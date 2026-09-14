/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // TODO: si las imágenes de Belén/Buen Vivir se sirven desde un dominio externo
    // (por ejemplo un CDN o Google Drive), agregar el hostname aquí.
    remotePatterns: [],
  },
};

export default nextConfig;

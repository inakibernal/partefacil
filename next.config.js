/** @type {import('next').NextConfig} */
const nextConfig = {
  // Si usas el App Router (app/), esto está OK.
  experimental: {
    // Puedes mantener otras flags que ya tuvieras aquí.
  },

  // Config de Turbopack: fija la raíz a ESTE directorio
  turbopack: {
    root: __dirname,
  },

  // Desactivar typecheck en build para MVP
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

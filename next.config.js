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
};

module.exports = nextConfig;

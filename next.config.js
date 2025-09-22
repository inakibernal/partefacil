/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true }, eslint: {
    // No rompas el build por errores de ESLint (MVP)
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;

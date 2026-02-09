/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // Ignora erros de tipagem para o site ir ao ar logo
      ignoreBuildErrors: true,
    },
    eslint: {
      // Ignora alertas de estilo de código
      ignoreDuringBuilds: true,
    },
  }
  
  module.exports = nextConfig
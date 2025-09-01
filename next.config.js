/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true, // Required for static export
  },
  output: 'export', // Enable static export
  trailingSlash: true, // Required for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/AI_FIESTA' : '', // Updated for your repo name
}

module.exports = nextConfig
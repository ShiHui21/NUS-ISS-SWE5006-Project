/** @type {import('next').NextConfig} */
// const nextConfig = {};
const nextConfig = {
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      unoptimized: true,
      domains: ['i.ebayimg.com', 's3.amazonaws.com'], // Add your S3 bucket domain here too
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/:path*', // Proxy to Backend
        },
      ]
    },
  };

export default nextConfig;

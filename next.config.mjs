/** @type {import('next').NextConfig} */
const repoName = 'smart-classroom';

const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  ...(isProd ? {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
  } : {}),
};

export default nextConfig;
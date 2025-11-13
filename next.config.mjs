/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ PDF Worker fix for react-pdf on Next.js 16
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker\.min\.js$/,
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;

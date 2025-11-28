// next.config.mjs
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    // Allow importing .mjs (ES modules) from pdfjs-dist
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
};

export default nextConfig;

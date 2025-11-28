/** next.config.js */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // allow importing .mjs from pdfjs-dist (ES modules)
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
};

module.exports = nextConfig;

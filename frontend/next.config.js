/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      child_process: false,
      readline: false
    };
    return config;
  },
};

module.exports = nextConfig;

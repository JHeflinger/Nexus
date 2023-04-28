module.exports = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, "crypto": false };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: true,
      },
    ]
  },
};
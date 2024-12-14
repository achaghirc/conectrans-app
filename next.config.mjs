/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          //CORS policy
          {
            key: 'Access-Control-Allow-Origin',
            value: '*s'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Accept, Origin, Authorization'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
        ]
      }
    ]
  },
  images: {
      remotePatterns: [
          {
              protocol: 'http',
              hostname: 'res.cloudinary.com',
          }

      ],
  },
  webpack: (config, { isServer }) => {
      config.module.rules.push({
          test: /\.html$/,
          use: 'ignore-loader',
        });
      return config;
  }
};

export default nextConfig;

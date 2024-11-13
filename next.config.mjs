/** @type {import('next').NextConfig} */

const nextConfig = {
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

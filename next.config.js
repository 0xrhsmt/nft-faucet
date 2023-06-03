/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: config => {
        // For Rainbowkit v1
        // ref. https://www.rainbowkit.com/docs/installation#additional-build-tooling-setup
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
}

module.exports = nextConfig

// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)", // Tüm sayfalar için
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "script-src 'self'; object-src 'none';", // Temel CSP örneği
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

// next.config.js
export default {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        // Hızlı çözüm: inline ve eval'e izin ver!
                        value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app *.neurodrafts.com; object-src 'none';"
                    },
                ],
            },
        ];
    },
}

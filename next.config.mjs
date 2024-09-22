/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/frame-image',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'image/png',
                    },
                ],
            },
        ];
    },
    // Add any other Next.js config options here
};

export default nextConfig;

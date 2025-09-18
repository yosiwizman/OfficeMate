/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Keep embedding friendly for Desktop iframe
  { key: 'X-Frame-Options', value: '' },
  { key: 'Content-Security-Policy', value: "frame-ancestors *;" },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

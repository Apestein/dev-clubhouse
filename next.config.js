/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["api.dicebear.com", "avatars.githubusercontent.com"],
  },
}

module.exports = nextConfig

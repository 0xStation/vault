/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "pbs.twimg.com",
      "user-images.githubusercontent.com",
      "station-images.nyc3.digitaloceanspaces.com",
      "cdn.discordapp.com",
      "avatar.tobi.sh",
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig

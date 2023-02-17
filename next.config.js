/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "pbs.twimg.com",
      "user-images.githubusercontent.com",
      "station-images.nyc3.digitaloceanspaces.com",
      "cdn.discordapp.com",
      "avatar.tobi.sh",
      "gateway.ipfs.io", // ENS avatars
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig

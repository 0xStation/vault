/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "c.neevacdn.net", // nft previews
      "pbs.twimg.com",
      "user-images.githubusercontent.com",
      "station-images.nyc3.digitaloceanspaces.com",
      "cdn.discordapp.com",
      "avatar.tobi.sh",
      "gateway.ipfs.io", // ENS avatars,
      "i.seadn.io", // ENS avatars
      "safe-transaction-assets.safe.global",
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig

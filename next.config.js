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
      "assets.coingecko.com", // token logos from N
    ],
  },
}

module.exports = nextConfig

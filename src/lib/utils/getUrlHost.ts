export const getUrlHost = () => {
  const hostname = process.env.NEXT_PUBLIC_VERCEL_URL
  if (!hostname) {
    return "http://localhost:3000"
  }
  return `https://${hostname}`
}

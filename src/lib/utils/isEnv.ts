export const isProd = () => {
  return !!(process.env.NEXT_PUBLIC_VERCEL_ENV === "production")
}

export const isStaging = () => {
  return !!(process.env.NEXT_PUBLIC_VERCEL_ENV === "preview")
}

export const isDev = () => {
  return !!(
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ||
    (!isStaging() && !isProd())
  )
}

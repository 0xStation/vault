import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const useIsRouterLoading = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = (url: string, { shallow }: { shallow: boolean }) => {
      url !== router.asPath && !shallow && setLoading(true)
    }
    const handleComplete = (url: string) => {
      // timeout is used to prevent glitching from loading to page
      setLoading(false)
    }

    router.events.on("routeChangeStart", handleStart)
    router.events.on("routeChangeComplete", handleComplete)
    router.events.on("routeChangeError", handleComplete)

    return () => {
      router.events.off("routeChangeStart", handleStart)
      router.events.off("routeChangeComplete", handleComplete)
      router.events.off("routeChangeError", handleComplete)
    }
  })

  return [loading]
}

import Breakpoint from "@ui/Breakpoint"
import truncateString from "lib/utils"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEnsName } from "wagmi"
import Desktop from "../../../src/components/pages/profile/Desktop"
import Mobile from "../../../src/components/pages/profile/Mobile"

const ProfilePage = ({}: {}) => {
  const router = useRouter()
  const { data: ensName } = useEnsName({
    address: router.query?.address as `0x${string}`,
    chainId: 1,
    cacheTime: 60 * 60 * 1000, // (1 hr) time (in ms) which the data should remain in the cache
  })

  return (
    <>
      <Head>
        <title>
          Profile |{" "}
          {ensName ||
            (router?.query?.address &&
              truncateString(router.query?.address as string))}
        </title>
        <meta property="og:image" content={"/api/v1/og?title=test post"} />
        <meta name="twitter:image" content={"/api/v1/og?title=test post"} />
      </Head>
      <Breakpoint>
        {(isMobile) => {
          if (isMobile) {
            return <Mobile />
          }
          return <Desktop />
        }}
      </Breakpoint>
    </>
  )
}

export default ProfilePage

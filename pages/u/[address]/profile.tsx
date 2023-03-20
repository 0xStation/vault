import Breakpoint from "@ui/Breakpoint"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks/useTerminalByChainIdAndSafeAddress"
import { convertGlobalId } from "models/terminal/utils"
import Head from "next/head"
import { useRouter } from "next/router"
import Desktop from "../../../src/components/pages/profile/Desktop"
import Mobile from "../../../src/components/pages/profile/Mobile"

const ProfilePage = ({}: {}) => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { terminal } = useTerminalByChainIdAndSafeAddress(
    address as string,
    chainId as number,
  )
  return (
    <>
      <Head>
        <title>Proposals | {terminal?.data.name}</title>
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

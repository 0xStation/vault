import Breakpoint from "@ui/Breakpoint"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { convertGlobalId } from "models/terminal/utils"
import Head from "next/head"
import { useRouter } from "next/router"
import Desktop from "../../../src/components/pages/automations/Desktop"
import Mobile from "../../../src/components/pages/automations/Mobile"
import { useIsSigner } from "../../../src/hooks/useIsSigner"

const AutomationsPage = () => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  useIsSigner({ chainId: chainId as number, address: address as string })
  const { terminal } = useTerminalByChainIdAndSafeAddress(
    address as string,
    chainId as number,
  )

  return (
    <>
      <Head>
        <title>Automation | {terminal?.data?.name}</title>
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

export default AutomationsPage

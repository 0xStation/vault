import { useDynamicContext } from "@dynamic-labs/sdk-react"
import Breakpoint from "@ui/Breakpoint"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { convertGlobalId } from "models/terminal/utils"
import Head from "next/head"
import { useRouter } from "next/router"
import Desktop from "../../../src/components/pages/invoices/Desktop"
import Mobile from "../../../src/components/pages/invoices/Mobile"
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
  const { primaryWallet } = useDynamicContext()

  if (!terminal) {
    if (primaryWallet?.address) {
      router.push(`/u/${primaryWallet?.address}`)
    } else {
      router.push("/")
    }
  }

  return (
    <>
      <Head>
        <title>Invoices | {terminal?.data?.name}</title>
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

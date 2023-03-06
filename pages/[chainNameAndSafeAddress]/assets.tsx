import Breakpoint from "@ui/Breakpoint/Breakpoint"
import Desktop from "../../src/components/pages/assets/Desktop"
import Mobile from "../../src/components/pages/assets/Mobile"
import { useTerminalByChainIdAndSafeAddress } from "../../src/models/terminal/hooks"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const AssetsPage = () => {
  // router.query doesn't work during pre-rendering unless we are using ssr
  const chainNameAndSafeAddress = decodeURIComponent(
    window.location.pathname.split("/")[1],
  ) as string
  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  const chainId = chainNameToChainId[chainName] as number
  const { terminal } = useTerminalByChainIdAndSafeAddress(safeAddress, chainId)

  if (!terminal) return <></>

  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) {
          return <Mobile terminal={terminal} />
        }
        return <Desktop terminal={terminal} />
      }}
    </Breakpoint>
  )
}

export default AssetsPage

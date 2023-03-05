import { useRouter } from "next/router"
import { useTerminalByChainIdAndSafeAddress } from "../../../models/terminal/hooks"
import DesktopTerminalLayout from "../../terminal/DesktopTerminalLayout"
import AssetsPageContent from "./components/AssetPageContent"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const Desktop = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query as {
    chainNameAndSafeAddress: string
  }
  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  const chainId = chainNameToChainId[chainName] as number
  const { terminal } = useTerminalByChainIdAndSafeAddress(safeAddress, chainId)

  if (!terminal) return <></>

  return (
    <DesktopTerminalLayout terminal={terminal}>
      <AssetsPageContent terminal={terminal} />
    </DesktopTerminalLayout>
  )
}

export default Desktop

import { useRouter } from "next/router"
import { useTerminalByChainIdAndSafeAddress } from "../../../models/terminal/hooks"
import DesktopTerminalLayout from "../../terminal/DesktopTerminalLayout"
import MembersPageContent from "./components/MembersPageContent"

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
      <MembersPageContent />
    </DesktopTerminalLayout>
  )
}

export default Desktop

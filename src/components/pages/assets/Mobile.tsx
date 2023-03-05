import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { useTerminalByChainIdAndSafeAddress } from "../../../models/terminal/hooks"
import AccountNavBar from "../../core/AccountNavBar"
import AssetsPageContent from "./components/AssetPageContent"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const Mobile = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query as {
    chainNameAndSafeAddress: string
  }
  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  const chainId = chainNameToChainId[chainName] as number
  const { terminal } = useTerminalByChainIdAndSafeAddress(safeAddress, chainId)

  if (!terminal) return <></>
  return (
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <AssetsPageContent terminal={terminal} />
    </>
  )
}

export default Mobile

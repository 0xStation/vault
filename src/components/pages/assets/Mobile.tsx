import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { Terminal } from "../../../models/terminal/types"
import AccountNavBar from "../../core/AccountNavBar"
import AssetsPageContent from "./components/AssetPageContent"

const Mobile = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()

  if (!terminal) return <></>
  return (
    <div className="flex h-screen grow flex-col pb-4">
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <AssetsPageContent terminal={terminal} />
    </div>
  )
}

export default Mobile

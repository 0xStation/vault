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

import { ArrowLeft } from "@icons"
import ClaimListView from "components/claim/ClaimListView"
import AccountNavBar from "components/core/AccountNavBar"
import Link from "next/link"
import { useRouter } from "next/router"

const TerminalClaimListView = ({}: {}) => {
  const router = useRouter()

  return (
    <div className="flex h-screen grow flex-col pb-4">
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <ClaimListView />
    </div>
  )
}

export default TerminalClaimListView

import { ArrowLeft } from "@icons"
import ClaimListView from "components/claim/ClaimListView"
import AccountNavBar from "components/core/AccountNavBar"
import { convertGlobalId } from "models/terminal/utils"
import Link from "next/link"
import { useRouter } from "next/router"

const TerminalClaimListView = ({}: {}) => {
  const router = useRouter()
  const { address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  return (
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <ClaimListView recipientAddress={address!} />
    </>
  )
}

export default TerminalClaimListView

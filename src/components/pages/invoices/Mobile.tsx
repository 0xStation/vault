import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountNavBar from "../../core/AccountNavBar"
import InvoicesPageContent from "./components/InvoicesPageContent"

const Mobile = () => {
  const router = useRouter()

  return (
    <div className="flex h-screen flex-col pb-4">
      <AccountNavBar />
      {/* link probably needs to go back to a different page here */}
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <InvoicesPageContent />
    </div>
  )
}

export default Mobile

import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountNavBar from "../../core/AccountNavBar"
import AutomationsPageContent from "./components/AutomationsPageContent"

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
      <AutomationsPageContent />
    </div>
  )
}

export default Mobile

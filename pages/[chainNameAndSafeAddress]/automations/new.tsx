import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountNavBar from "../../../src/components/core/AccountNavBar"
import NewAutomationContent from "../../../src/components/pages/newAutomation/components/NewAutomationContent"

const NewAutomationPage = () => {
  const router = useRouter()
  return (
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <NewAutomationContent />
    </>
  )
}

export default NewAutomationPage

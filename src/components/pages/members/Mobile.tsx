import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountNavBar from "../../core/AccountNavBar"
import MembersPageContent from "./components/MembersPageContent"

const Mobile = () => {
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
      <MembersPageContent />
    </>
  )
}

export default Mobile

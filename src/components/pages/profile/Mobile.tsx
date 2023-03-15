import { ArrowLeft } from "@icons"
import { Address } from "@ui/Address"
import { Avatar } from "@ui/Avatar"
import Link from "next/link"
import { useRouter } from "next/router"
import { useTerminalsBySigner } from "../../../models/terminal/hooks"
import AccountNavBar from "../../core/AccountNavBar"
import ProfilePageContent from "./components/ProfilePageContent"

const Mobile = () => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { isLoading, count } = useTerminalsBySigner(accountAddress)

  return (
    <>
      <AccountNavBar />
      {/* link probably needs to go back to a different page here */}
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <div className="mt-6 flex flex-row items-center space-x-3">
        <Avatar address={accountAddress} size="lg" />
        <div className="items-left flex flex-col">
          <Address address={accountAddress} size="lg" />
          {isLoading ? (
            <div className="h-4 w-20 animate-pulse rounded-md bg-gray-80"></div>
          ) : (
            <div className="text-sm">
              <span className="font-bold">{count}</span>{" "}
              <span className="text-gray">Project{count === 1 ? "" : "s"}</span>
            </div>
          )}
        </div>
      </div>
      <ProfilePageContent />
    </>
  )
}

export default Mobile

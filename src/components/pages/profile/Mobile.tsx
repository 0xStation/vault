import { Address } from "@ui/Address"
import { Avatar } from "@ui/Avatar"
import { useRouter } from "next/router"
import { useNetwork } from "wagmi"
import { useTerminalsBySigner } from "../../../models/terminal/hooks"
import AccountNavBar from "../../core/AccountNavBar"
import ProfilePageContent from "./components/ProfilePageContent"

const Mobile = () => {
  const router = useRouter()
  const accountAddress = router.query.address as string
  const { chain } = useNetwork()
  const { isLoading, count } = useTerminalsBySigner(
    accountAddress,
    chain?.id as number,
  )

  return (
    <div className="flex h-screen flex-col pb-4">
      <AccountNavBar />
      <div className="mt-6 flex flex-row items-center space-x-3 px-4">
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
    </div>
  )
}

export default Mobile

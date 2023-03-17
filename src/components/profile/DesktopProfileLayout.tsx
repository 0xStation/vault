import { Address } from "@ui/Address"
import { Avatar } from "@ui/Avatar"
import { useRouter } from "next/router"
import { useTerminalsBySigner } from "../../models/terminal/hooks"
import { AccountNavBar } from "../core/AccountNavBar/AccountDropdown"
import { StationLogo } from "../icons"

const DesktopProfileLayout = ({
  assumeDefaultPadding = true,
  children,
}: {
  assumeDefaultPadding?: boolean
  children?: React.ReactNode
}) => {
  const router = useRouter()
  const { address: accountAddress } = router.query
  const { isLoading, count } = useTerminalsBySigner(accountAddress as string)

  return (
    <>
      <div className="flex h-screen flex-row">
        <div className="relative h-full w-[300px]">
          <section className="flex flex-row items-center justify-between p-4">
            <StationLogo size="lg" />
          </section>
          <div className="h-[90%] border-r border-gray-90">
            <section className="mt-4 p-4">
              <div className="flex flex-row items-center space-x-2 rounded-t-xl bg-gray-100 p-4">
                <Avatar address={accountAddress as string} size="lg" />
                <Address address={accountAddress as string} size="lg" />
              </div>
              <div className="rounded-b-xl bg-gray-90 p-4">
                <h4 className="mb-1 text-sm text-gray">Projects</h4>
                <span>{count}</span>
              </div>
            </section>
          </div>
        </div>
        <div
          className={`flex grow flex-col overflow-y-auto ${
            assumeDefaultPadding ? "px-12 py-4" : "p-0"
          }`}
        >
          <div className="flex justify-end">
            <AccountNavBar />
          </div>

          {children}
        </div>
      </div>
    </>
  )
}

export default DesktopProfileLayout

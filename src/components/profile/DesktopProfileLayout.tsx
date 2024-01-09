import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { Address } from "@ui/Address"
import { Avatar } from "@ui/Avatar"
import { ProfileReadyToClaim } from "components/claim/ProfileReadyToClaim"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useTerminalsBySigner } from "../../models/terminal/hooks"
import { AccountNavBar } from "../core/AccountNavBar/AccountDropdown"

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
  const { primaryWallet } = useDynamicContext()
  const isUsersProfile =
    primaryWallet?.address &&
    accountAddress &&
    accountAddress === primaryWallet?.address

  return (
    <>
      <div className="flex h-screen flex-row">
        <div className="relative h-full w-[300px]">
          <section className="flex flex-row items-center justify-between p-4">
            <Link href={`/u/${accountAddress}/profile`}>
              <Image
                src="/images/terminal-logo.webp"
                alt=""
                height={40}
                width={40}
                className="cursor-pointer transition-all hover:rotate-[15deg]"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Link>
          </section>
          <div className="h-[90%] overflow-auto border-r border-gray-90">
            <section className="p-4">
              <div className="flex flex-row items-center space-x-2 rounded-t-xl bg-gray-100 p-4">
                <Avatar address={accountAddress as string} size="lg" />
                <Address address={accountAddress as string} size="lg" />
              </div>
              <div className="rounded-b-xl bg-gray-90 p-4">
                <h4 className="mb-1 text-sm text-gray">Vaults</h4>
                <span>{count}</span>
              </div>
            </section>
            {isUsersProfile && (
              <div className="mt-6 space-y-3 px-4">
                <div>
                  <ProfileReadyToClaim />
                </div>
              </div>
            )}
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

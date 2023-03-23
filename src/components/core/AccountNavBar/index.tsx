import Image from "next/image"
import Link from "next/link"
import React from "react"
import { useAccount } from "wagmi"
import AccountDropdown from "./AccountDropdown"

export const AccountNavBar = () => {
  const { address: accountAddress } = useAccount()
  return (
    <nav className="flex w-full flex-row items-center justify-between px-4 pt-12 pb-3">
      <div className="hover:rotate-12 hover:animate-bounce">
        <Link href={`/u/${accountAddress}/profile`}>
          <Image
            src="/images/terminal-logo.webp"
            alt=""
            height={40}
            width={40}
          />
        </Link>
      </div>
      <AccountDropdown />
    </nav>
  )
}

export default AccountNavBar

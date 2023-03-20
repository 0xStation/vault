import Image from "next/image"
import React from "react"
import AccountDropdown from "./AccountDropdown"

export const AccountNavBar = () => {
  return (
    <nav className="flex w-full flex-row items-center justify-between px-4 pt-12 pb-3">
      <Image src="/images/terminal-logo.webp" alt="" height={40} width={40} />
      <AccountDropdown />
    </nav>
  )
}

export default AccountNavBar

import React from "react"
import HamburgerMenuIcon from "@heroicons/react/24/solid/Bars2Icon"
import AccountDropdown from "./AccountDropdown"

export const AccountNavBar = () => {
  return (
    <nav className="flex w-full flex-row items-center justify-between px-4 pt-12 pb-3">
      <HamburgerMenuIcon className="h-5 w-5" />
      <AccountDropdown />
    </nav>
  )
}

export default AccountNavBar

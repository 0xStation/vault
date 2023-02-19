import HamburgerMenuIcon from "@heroicons/react/24/solid/Bars2Icon"
import Link from "next/link"
import { useState } from "react"
import SlideOver from "../../ui/SlideOver"
import AccountDropdown from "./AccountDropdown"

export const AccountNavBar = () => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <>
      <SlideOver open={open} setOpen={setOpen}>
        <ul className="space-y-4 text-[20px]">
          <li>
            <Link href="/">Requests</Link>
          </li>
          <li>
            <Link href="/">Assets</Link>
          </li>
          <li>
            <Link href="/">Members</Link>
          </li>
          <li>
            <Link href="/">Workflows</Link>
          </li>
          <li>
            <Link href="/">Terminal Details</Link>
          </li>
        </ul>
        <span className="fixed bottom-0 mb-4 border-b border-dotted text-xs">
          Support
        </span>
      </SlideOver>
      <nav className="flex w-full flex-row items-center justify-between px-4 pt-12 pb-3">
        <span onClick={() => setOpen(true)} className="cursor-pointer">
          <HamburgerMenuIcon className="h-5 w-5" />
        </span>
        <AccountDropdown />
      </nav>
    </>
  )
}

export default AccountNavBar

import { TerminalLogo } from "../../icons"
import AccountDropdown from "./AccountDropdown"

export const AccountNavBar = () => {
  return (
    <nav className="flex w-full flex-row items-center justify-between px-4 pt-12 pb-3">
      <TerminalLogo size="lg" />
      <AccountDropdown />
    </nav>
  )
}

export default AccountNavBar

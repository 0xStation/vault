import { Button } from "@ui/Button"
import { useState } from "react"
import { AccountNavBar } from "../src/components/core/AccountNavBar"
import TerminalNavBar from "../src/components/core/TerminalNavBar"
import TerminalCreationDrawer from "../src/components/terminalCreation/Drawer"

function Page() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <AccountNavBar />
      <TerminalNavBar />
      <div className="mt-20 flex h-full w-full justify-center">
        <Button onClick={() => setIsOpen(true)}>Click me</Button>
      </div>
      <TerminalCreationDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default Page

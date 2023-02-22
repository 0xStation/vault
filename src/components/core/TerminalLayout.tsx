import truncateString from "lib/utils"
import { Terminal } from "../../../src/models/terminal/types"
import { AccountNavBar } from "./AccountNavBar"
import CopyToClipboard from "./CopyToClipboard"
import { ChainPill } from "./Pills/ChainPill"

const TerminalLayout = ({
  terminal,
  children,
}: {
  terminal: Terminal
  children: any
}) => {
  return (
    <>
      <AccountNavBar />
      <section className="px-4">
        <h1 className="text-[20px]">{terminal.data.name}</h1>
        <div className="mt-2 flex flex-row items-center space-x-1">
          {/* TODO: the chain pill in the mocks has no background color on the terminal page but not sure if it would mess up other uses of chainpill if I take that out... leaving the bg color for now */}
          <ChainPill chainId={terminal.chainId} />
          <span className="text-xs">
            {truncateString(terminal.safeAddress)}
          </span>
          <CopyToClipboard text={terminal.safeAddress} />
        </div>
      </section>
      {children}
    </>
  )
}

export default TerminalLayout

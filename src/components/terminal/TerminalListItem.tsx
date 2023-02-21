import { Network } from "@ui/Network"
import Link from "next/link"
import { Terminal } from "../../models/terminal/types"
import { globalId } from "../../models/terminal/utils"

const TerminalListItem = ({ terminal }: { terminal: Terminal }) => {
  return (
    <Link
      href={`/${globalId(terminal.chainId, terminal.safeAddress)}/requests`} // TODO: change to info page
    >
      <div className="space-y-2 border-t border-b border-slate-200 px-4 py-3 hover:bg-slate-50">
        <p className="font-bold">{terminal.data.name}</p>
        <div className="flex flex-row space-x-2">
          <Network chainId={terminal.chainId} />
        </div>
      </div>
    </Link>
  )
}

export default TerminalListItem

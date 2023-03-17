import { Network } from "@ui/Network"
import Link from "next/link"
import { Terminal } from "../../models/terminal/types"
import { globalId } from "../../models/terminal/utils"

const TerminalListItem = ({ terminal }: { terminal: Terminal }) => {
  return (
    <Link href={`/${globalId(terminal.chainId, terminal.safeAddress)}`}>
      <div className="space-y-2 border-b border-gray-80 px-4 py-3 hover:bg-gray-90 sm:rounded sm:border-x sm:border-t">
        <p className="text-lg font-bold">{terminal.data.name}</p>
        <div className="flex flex-row space-x-2 text-gray-50">
          <Network chainId={terminal.chainId} />
        </div>
      </div>
    </Link>
  )
}

export default TerminalListItem

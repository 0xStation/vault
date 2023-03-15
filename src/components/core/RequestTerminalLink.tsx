import Link from "next/link"
import { Terminal } from "../../models/terminal/types"
import { globalId } from "../../models/terminal/utils"

// recently deprecated, keeping here just in case
const RequestTerminalLink = ({ terminal }: { terminal: Terminal }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="mr-10 min-w-0 grow">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray">
          {terminal.data.name}
        </div>
      </div>
      <Link href={`/${globalId(terminal.chainId, terminal.safeAddress)}`}>
        <div className="w-20 border-b border-dotted text-sm hover:text-gray">
          Go to Project
        </div>
      </Link>
    </div>
  )
}

export default RequestTerminalLink

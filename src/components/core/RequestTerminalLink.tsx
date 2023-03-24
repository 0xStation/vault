import { networkIconConfig } from "@ui/Network"
import Link from "next/link"
import { Terminal } from "../../models/terminal/types"
import { globalId } from "../../models/terminal/utils"

// recently deprecated, keeping here just in case
const RequestTerminalLink = ({ terminal }: { terminal: Terminal }) => {
  console.log("terminal", terminal)
  return (
    <div className="flex flex-row items-center pl-0 sm:pl-4">
      <div className="mr-10 min-w-0 grow">
        <div className="flex flex-row items-center space-x-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray">
          <div className="items-center">
            {terminal?.chainId && networkIconConfig[terminal?.chainId]?.icon}
          </div>
          <p>{terminal.data.name} </p>
        </div>
      </div>
      <Link href={`/${globalId(terminal.chainId, terminal.safeAddress)}`}>
        <div className="w-fit text-sm text-violet hover:text-violet-80">
          Go to Project
        </div>
      </Link>
    </div>
  )
}

export default RequestTerminalLink

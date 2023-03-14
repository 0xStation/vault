import { Network } from "@ui/Network"
import truncateString from "lib/utils"
import { Terminal } from "../../../../models/terminal/types"
import CopyToClipboard from "../../../core/CopyToClipboard"

const TerminalDetailsPageContent = ({ terminal }: { terminal: Terminal }) => {
  return (
    <div>
      <section className="mt-6 px-4">
        <h1 className="text-xl font-bold">{terminal.data.name}</h1>
        <div className="mt-2 flex flex-row items-center space-x-1">
          <Network chainId={terminal.chainId} />
          <span className="text-sm">·</span>
          <span className="text-sm">
            {truncateString(terminal.safeAddress)}
          </span>
          <CopyToClipboard text={terminal.safeAddress} />
        </div>
        {terminal.data.url && (
          <a
            href={terminal.data.url}
            target="_blank"
            className="mt-6 inline-block border-b border-dotted text-base hover:text-gray"
            rel="noreferrer"
          >
            {terminal.data.url}
          </a>
        )}
        <p className="mt-6">{terminal.data.description}</p>
      </section>
    </div>
  )
}

export default TerminalDetailsPageContent

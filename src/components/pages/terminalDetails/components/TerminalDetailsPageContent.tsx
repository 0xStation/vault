import { Terminal } from "../../../../models/terminal/types"

const TerminalDetailsPageContent = ({ terminal }: { terminal: Terminal }) => {
  return (
    <div>
      <section className="mt-6 px-4">
        <h1>About</h1>
        <div className="mt-6 flex flex-row items-center space-x-1"></div>
        {terminal?.data?.url && (
          <a
            href={terminal?.data?.url}
            target="_blank"
            className="mt-6 inline-block text-base text-violet hover:text-violet-80"
            rel="noreferrer"
          >
            {terminal?.data?.url}
          </a>
        )}
        <p className="mt-6">{terminal?.data?.description}</p>
      </section>
    </div>
  )
}

export default TerminalDetailsPageContent

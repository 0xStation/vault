import { PencilIcon } from "@heroicons/react/24/solid"
import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { Terminal } from "../../../../src/models/terminal/types"
import AccountNavBar from "../../core/AccountNavBar"
import TerminalDetailsPageContent from "./components/TerminalDetailsPageContent"

const EditButton = ({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} h-fit p-2 hover:bg-slate-200`}
    >
      <PencilIcon className="w-2.5" />
    </button>
  )
}

const Mobile = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  return (
    <>
      <AccountNavBar />
      <div className="flex justify-between">
        <Link
          href={`/${router.query.chainNameAndSafeAddress}`}
          className="block w-fit px-4"
        >
          <ArrowLeft />
        </Link>
        <EditButton
          onClick={() =>
            router.push(`/${chainNameAndSafeAddress}/details/edit`)
          }
          className="ml-2 mr-4 rounded border border-slate-200"
        />
      </div>
      <TerminalDetailsPageContent terminal={terminal} />
    </>
  )
}

export default Mobile

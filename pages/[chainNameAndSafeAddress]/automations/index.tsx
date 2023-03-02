import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { AutomationListItem } from "../../../src/components/automation/AutomationListItem"
import { CreateAutomationDropdown } from "../../../src/components/automation/CreateAutomationDropdown"
import AccountNavBar from "../../../src/components/core/AccountNavBar"
import { EmptyList } from "../../../src/components/core/EmptyList"
import { useAutomations } from "../../../src/models/automation/hooks"
import { parseGlobalId } from "../../../src/models/terminal/utils"

const TerminalAutomationsPage = () => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  const { isLoading, automations } = useAutomations(chainId, address)

  return (
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="mt-2.5 block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <div className="mt-4 flex flex-row items-center justify-between border-b border-slate-200 px-4 pb-4">
        <span className="text-lg font-bold">Automations</span>
        <CreateAutomationDropdown />
      </div>
      {isLoading ? (
        <></>
      ) : automations?.length === 0 ? (
        <EmptyList
          title="No automations created"
          subtitle="Created automations will appear here"
        />
      ) : (
        <ul>
          {automations?.map((automation) => (
            <AutomationListItem
              automation={automation}
              key={`automation-${automation.id}`}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export default TerminalAutomationsPage

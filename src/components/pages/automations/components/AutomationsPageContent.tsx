import { useRouter } from "next/router"
import { useAutomations } from "../../../../../src/models/automation/hooks"
import { parseGlobalId } from "../../../../../src/models/terminal/utils"
import { AutomationListItem } from "../../../automation/AutomationListItem"
import { CreateAutomationDropdown } from "../../../automation/CreateAutomationDropdown"
import { EmptyList } from "../../../core/EmptyList"

const AutomationsPageContent = () => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  const { isLoading, automations } = useAutomations(chainId, address)

  return (
    <>
      <div className="mt-4 flex flex-row items-center justify-between px-4 pb-4 sm:px-0">
        <h1>Automations</h1>
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
        <ul className="sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4">
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

export default AutomationsPageContent

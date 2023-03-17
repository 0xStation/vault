import { EmptyState } from "components/emptyStates/EmptyState"
import { cn } from "lib/utils"
import { useRouter } from "next/router"
import { useAutomations } from "../../../../../src/models/automation/hooks"
import { parseGlobalId } from "../../../../../src/models/terminal/utils"
import { AutomationListItem } from "../../../automation/AutomationListItem"
import { CreateAutomationDropdown } from "../../../automation/CreateAutomationDropdown"

const AutomationsPageContent = () => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  const { isLoading, automations } = useAutomations(chainId, address)
  const noAutomations = !isLoading && automations?.length === 0

  return (
    <div className="mt-6 h-[calc(100%-84px)] px-4">
      <div
        className={cn(
          "mt-4 flex flex-row items-center justify-between px-4 pb-4 sm:px-0",
          noAutomations ? "" : "border-b border-gray-80 sm:border-none",
        )}
      >
        <h1>Automations</h1>
        <CreateAutomationDropdown />
      </div>
      {isLoading ? (
        <></>
      ) : noAutomations ? (
        <div className="flex h-[calc(100%-49px)] px-4 pb-4 pt-4 sm:h-full sm:px-0">
          <EmptyState
            title="Set up Automations"
            subtitle="Automate revenue-sharing from NFT sales and sponsorships."
          />
        </div>
      ) : (
        <ul className="px-0 sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4">
          {automations?.map((automation) => (
            <AutomationListItem
              automation={automation}
              key={`automation-${automation.id}`}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default AutomationsPageContent

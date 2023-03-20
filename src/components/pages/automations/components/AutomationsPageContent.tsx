import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button } from "@ui/Button"
import { EmptyState } from "components/emptyStates/EmptyState"
import { cn } from "lib/utils"
import { addQueryParam } from "lib/utils/updateQueryParam"
import { useRouter } from "next/router"
import { useAutomations } from "../../../../../src/models/automation/hooks"
import { parseGlobalId } from "../../../../../src/models/terminal/utils"
import { usePermissionsStore } from "../../../../hooks/stores/usePermissionsStore"
import { AutomationListItem } from "../../../automation/AutomationListItem"
import { CreateAutomationDropdown } from "../../../automation/CreateAutomationDropdown"

const AutomationsPageContent = () => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const isSigner = usePermissionsStore((state) => state.isSigner)

  const { isLoading, automations } = useAutomations(chainId, address)
  const noAutomations = !isLoading && automations?.length === 0

  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === "S"

  const emptyStateTitle = isSigner ? "Set up Automations" : "No automations"
  const emptyStateSubtitle = isSigner
    ? "Automate revenue-sharing from NFT sales and sponsorships."
    : "This Project hasn’t set up an Automation."

  return (
    <div className="mt-3 ml-2 h-[calc(100%-84px)]">
      <div
        className={cn(
          "mt-4 flex flex-row items-center justify-between px-4 pb-4 sm:px-0",
          noAutomations ? "" : "border-b border-gray-80 sm:border-none",
        )}
      >
        <h1>Automations</h1>
        {isSigner && <CreateAutomationDropdown />}
      </div>
      {isLoading ? (
        <></>
      ) : noAutomations ? (
        <div className="flex h-[calc(100%-49px)] px-4 pb-4 pt-4 sm:h-full sm:px-0">
          <EmptyState title={emptyStateTitle} subtitle={emptyStateSubtitle}>
            {isSigner ? (
              <span className="mx-auto">
                <Button
                  onClick={() => {
                    if (isMobile) {
                      router.push(
                        `/${router.query.chainNameAndSafeAddress}/automations/new`,
                      )
                    } else {
                      addQueryParam(
                        router,
                        "createAutomationSliderOpen",
                        "true",
                      )
                    }
                  }}
                >
                  Create
                </Button>
              </span>
            ) : null}
          </EmptyState>
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

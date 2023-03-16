import { PencilIcon } from "@heroicons/react/24/solid"
import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAutomation } from "../../../../../src/models/automation/hooks"
import AutomationHistory from "../../../automation/AutomationHistory"
import { AutomationInfo } from "../../../automation/AutomationInfo"
import { AutomationTabBar } from "../../../automation/AutomationTabBar"

export const AutomationDetailsContent = () => {
  const router = useRouter()
  // The automation id can be undefined when the page loads so the isLoading state
  // really isn't reliable
  const { automation } = useAutomation(router.query.automationId as string)

  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full items-center justify-between space-x-3 py-2 px-4 sm:hidden sm:px-0">
        <Link
          // TODO: change when directed to Automations from other locations, e.g. claiming
          href={`/${router.query.chainNameAndSafeAddress}/automations`}
          className="w-fit"
        >
          <ArrowLeft />
        </Link>

        <h4 className="text-base text-gray sm:hidden">
          {automation?.data.name}
        </h4>
        {/* TODO: add editing */}
        <button
          onClick={() => {
            console.log("edit automation")
          }}
          className={
            "invisible h-6 w-6 items-center rounded-md border border-gray-80 px-1.5"
          }
        >
          <PencilIcon className="w-2.5" />
        </button>
      </div>
      <AutomationTabBar>
        <AutomationInfo />
        <AutomationHistory automation={automation} isLoading={!automation} />
      </AutomationTabBar>
    </div>
  )
}

export default AutomationDetailsContent

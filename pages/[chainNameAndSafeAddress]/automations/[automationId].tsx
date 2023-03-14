import { PencilIcon } from "@heroicons/react/24/solid"
import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AutomationHistory from "../../../src/components/automation/AutomationHistory"
import { AutomationInfo } from "../../../src/components/automation/AutomationInfo"
import { AutomationTabBar } from "../../../src/components/automation/AutomationTabBar"
import AccountNavBar from "../../../src/components/core/AccountNavBar"
import { useAutomation } from "../../../src/models/automation/hooks"

export const TerminalAutomationDetailPage = () => {
  const router = useRouter()
  const { automation } = useAutomation(router.query.automationId as string)

  return (
    <>
      <AccountNavBar />
      <div className="flex w-full items-center justify-between space-x-3 py-2 px-4">
        <Link
          // TODO: change when directed to Automations from other locations, e.g. claiming
          href={`/${router.query.chainNameAndSafeAddress}/automations`}
          className="w-fit"
        >
          <ArrowLeft />
        </Link>

        <h4 className="text-sm text-gray">{automation?.data.name}</h4>
        {/* TODO: add editing */}
        <button
          onClick={() => {
            console.log("edit automation")
          }}
          className={
            "h-6 w-6 items-center rounded-md border border-gray-80 px-1.5"
          }
        >
          <PencilIcon className="w-2.5" />
        </button>
      </div>
      <AutomationTabBar>
        <AutomationInfo />
        <AutomationHistory />
      </AutomationTabBar>
    </>
  )
}

export default TerminalAutomationDetailPage

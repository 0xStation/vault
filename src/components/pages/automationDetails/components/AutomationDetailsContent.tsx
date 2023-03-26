import { PencilIcon } from "@heroicons/react/24/solid"
import { ArrowLeft } from "@icons"
import { getQueryParam } from "lib/utils/updateQueryParam"
import { useAutomation } from "models/automation/hooks"
import { RevShareFrob } from "models/automation/types"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AutomationHistory from "../../../automation/AutomationHistory"
import { AutomationInfo } from "../../../automation/AutomationInfo"
import { AutomationTabBar } from "../../../automation/AutomationTabBar"

export const AutomationDetailsContent = () => {
  const router = useRouter()
  let { automationId } = router.query
  // if the query param is set "shallowly" next router doesn't pick up on it
  // this happens on desktop, if the user clicks a request from the list
  // we can still grab it from the url manually
  if (!automationId) {
    automationId = getQueryParam("automationId") as string
  }

  const { automation } = useAutomation(automationId as string)
  const [revShare, setRevShare] = useState<RevShareFrob>()

  // prevents sliders from making content invisible as they disappear when query param is unset
  useEffect(() => {
    if (automation && automationId) {
      setRevShare(automation)
    }
  }, [automation, router.query.automationId])

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

        <h4 className="text-base text-gray sm:hidden">{revShare?.data.name}</h4>
        {/* TODO: add editing */}
        <button
          onClick={() => {
            console.log("edit automation")
          }}
          className={
            "hidden h-6 w-6 items-center rounded-md border border-gray-80 px-1.5"
          }
        >
          <PencilIcon className="w-2.5" />
        </button>
      </div>
      <AutomationTabBar>
        <AutomationInfo automation={revShare} />
        <AutomationHistory automation={revShare} isLoading={!revShare} />
      </AutomationTabBar>
    </div>
  )
}

export default AutomationDetailsContent

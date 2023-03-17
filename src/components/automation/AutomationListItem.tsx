import { ArrowSplit } from "@icons"
import Breakpoint from "@ui/Breakpoint"
import RightSlider from "@ui/RightSlider"
import { timeSince } from "lib/utils"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AutomationDetailsContent from "../../../src/components/pages/automationDetails/components/AutomationDetailsContent"
import { Automation } from "../../models/automation/types"
// import { ArrowSplit }   "../icons"

export const AutomationListItem = ({
  automation,
}: {
  automation: Automation
}) => {
  const router = useRouter()
  const [automationDetailsOpen, setAutomationDetailsOpen] =
    useState<boolean>(false)
  const closeAutomationDetailsSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "automationId")
    }
  }

  useEffect(() => {
    if (router.query.automationId) {
      setAutomationDetailsOpen(true)
    } else {
      setAutomationDetailsOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider
        open={automationDetailsOpen}
        setOpen={closeAutomationDetailsSlider}
      >
        <AutomationDetailsContent />
      </RightSlider>
      <Breakpoint>
        {(isMobile) => {
          if (isMobile) {
            return (
              <Link
                href={`/${router.query.chainNameAndSafeAddress}/automations/${automation.id}`}
              >
                <div className="space-y-2 border-b border-gray-80 py-3 px-4 hover:bg-gray-90 sm:rounded sm:border-x sm:border-t">
                  {/* TODO: Unhide this after we implement edit automation */}
                  {/* <div className="flex flex-row items-center space-x-1"> */}
                  {/* <span className="h-2 w-2 rounded-full bg-green"></span> */}
                  {/* <span className="text-base text-gray">Live</span> */}
                  {/* </div> */}
                  <div className="mt-2 mb-2 flex flex-row items-center justify-between">
                    <span className="text-lg font-bold">
                      {automation.data.name}
                    </span>
                    <span className="text-sm text-gray-50">
                      {timeSince(automation.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-row items-center space-x-1.5">
                    <ArrowSplit size="sm" color="gray" />
                    <span className="text-base text-gray">Revenue Share</span>
                  </div>
                </div>
              </Link>
            )
          }
          return (
            <div
              className="space-y-2 border-b border-gray-80 py-3 px-4 hover:bg-gray-90 sm:rounded sm:border-x sm:border-t"
              onClick={() => {
                setAutomationDetailsOpen(true)
                addQueryParam(router, "automationId", automation.id)
              }}
            >
              {/* TODO: Unhide this after we implement edit automation */}
              {/* <div className="flex flex-row items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-green"></span>
                <span className="text-base text-gray">Live</span>
              </div> */}
              <div className="flex flex-row items-center justify-between">
                <span className="text-lg font-bold">
                  {automation.data.name}
                </span>
                <span className="text-sm text-gray-50">
                  {timeSince(automation.createdAt)}
                </span>
              </div>
              <div className="flex flex-row items-center space-x-1">
                <ArrowSplit size="sm" color="gray" />
                <span className="text-base text-gray">Revenue Share</span>
              </div>
            </div>
          )
        }}
      </Breakpoint>
    </>
  )
}

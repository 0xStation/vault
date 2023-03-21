import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button } from "@ui/Button"
import { cn } from "lib/utils"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/router"
import NftRevShare2Image from "public/images/nft-rev-share-2.webp"
import React, { useEffect, useState } from "react"
import { useAutomations } from "../../../../../src/models/automation/hooks"
import { parseGlobalId } from "../../../../../src/models/terminal/utils"
import { usePermissionsStore } from "../../../../hooks/stores/usePermissionsStore"
import { AutomationListItem } from "../../../automation/AutomationListItem"
import { useRevSharePrompt } from "./useRevSharePrompt"

const BottomDrawer = dynamic(() =>
  import("../../../ui/BottomDrawer").then((mod) => mod.BottomDrawer),
)
const Modal = dynamic(() =>
  import("../../../ui/Modal").then((mod) => mod.Modal),
)
const RightSlider = dynamic(() =>
  import("../../../ui/RightSlider").then((mod) => mod.RightSlider),
)
const AutomationDetailsContent = dynamic(() =>
  import(
    "components/pages/automationDetails/components/AutomationDetailsContent"
  ).then((mod) => mod.AutomationDetailsContent),
)
const EmptyState = dynamic(() =>
  import("components/emptyStates/EmptyState").then((mod) => mod.EmptyState),
)

const CreateAutomationDropdown = dynamic(() =>
  import("../../../automation/CreateAutomationDropdown").then(
    (mod) => mod.CreateAutomationDropdown,
  ),
)

const AutomationsPageContent = () => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const isSigner = usePermissionsStore((state) => state.isSigner)

  const { isLoading, automations } = useAutomations(chainId, address)
  const noAutomations = !isLoading && automations?.length === 0

  const { isMobile } = useBreakpoint()

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
  }, [automations, router.query.automationId])

  const emptyStateTitle = isSigner ? "Set up Automations" : "No Automations"
  const emptyStateSubtitle = isSigner
    ? "Automate your collective operations — sharing on-chain revenue from NFT sales and project sponsorship"
    : "This Project hasn’t set up an Automation."

  const { children: revSharePrompt, isOpen, setIsOpen } = useRevSharePrompt()

  return (
    <>
      {isMobile ? (
        <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
          {revSharePrompt}
        </BottomDrawer>
      ) : (
        <>
          <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            {revSharePrompt}
          </Modal>
          <RightSlider
            open={automationDetailsOpen}
            setOpen={closeAutomationDetailsSlider}
            useInnerPadding={false}
          >
            <AutomationDetailsContent />
          </RightSlider>
        </>
      )}
      <div className="mt-3 h-[calc(100%-84px)]">
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
                <>
                  <Image src={NftRevShare2Image} alt="NFT rev share image" />
                  <span className="mx-auto mt-6">
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
                </>
              ) : null}
            </EmptyState>
          </div>
        ) : isMobile ? (
          <ul className="px-0 sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4">
            {automations?.map((automation) => (
              <AutomationListItem
                automation={automation}
                key={`automation-${automation.id}`}
                onClick={() => {
                  router.push(
                    `/${router.query.chainNameAndSafeAddress}/automations/${automation.id}`,
                  )
                }}
              />
            ))}
          </ul>
        ) : (
          <ul className="px-0 sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4">
            {automations?.map((automation) => (
              <AutomationListItem
                automation={automation}
                key={`automation-${automation.id}`}
                onClick={() => {
                  addQueryParam(router, "automationId", automation.id)
                  setAutomationDetailsOpen(true)
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default AutomationsPageContent

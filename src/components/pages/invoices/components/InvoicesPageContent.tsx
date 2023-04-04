import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button } from "@ui/Button"
import { cn } from "lib/utils"
import { addQueryParam } from "lib/utils/updateQueryParam"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useRouter } from "next/router"
import NftRevShare2Image from "public/images/nft-rev-share-2.webp"
import React from "react"
import { useAutomations } from "../../../../../src/models/automation/hooks"
import { parseGlobalId } from "../../../../../src/models/terminal/utils"
import { usePermissionsStore } from "../../../../hooks/stores/usePermissionsStore"

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

const InvoicesPageContent = () => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const isSigner = usePermissionsStore((state) => state.isSigner)

  const { isLoading, automations } = useAutomations(chainId, address)
  const noAutomations = !isLoading && automations?.length === 0

  const { isMobile } = useBreakpoint()

  const emptyStateTitle = isSigner ? "Set up Invoices" : "No Invoices"
  const emptyStateSubtitle = isSigner
    ? "Request an Invoice and split stuff"
    : "This Project doesn't have any Invoices."

  return (
    <div className="mt-3 h-[calc(100%-84px)]">
      <div
        className={cn(
          "mt-4 flex flex-row items-center justify-between px-4 pb-4 sm:px-0",
          noAutomations ? "" : "border-b border-gray-80 sm:border-none",
        )}
      >
        <h1>Invoices</h1>
        {isSigner && (
          <Button
            onClick={() => {
              if (isMobile) {
                router.push(
                  `/${router.query.chainNameAndSafeAddress}/invoices/new`,
                )
              } else {
                addQueryParam(router, "createInvoiceSliderOpen", "true")
              }
            }}
          >
            + Generate
          </Button>
        )}
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
                          `/${router.query.chainNameAndSafeAddress}/invoices/new`,
                        )
                      } else {
                        addQueryParam(router, "createInvoiceSliderOpen", "true")
                      }
                    }}
                  >
                    Generate
                  </Button>
                </span>
              </>
            ) : null}
          </EmptyState>
        </div>
      ) : isMobile ? (
        <ul className="px-0 sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4">
          {/* {automations?.map((automation) => (
            <AutomationListItem
              automation={automation}
              key={`automation-${automation.id}`}
              onClick={() => {
                router.push(
                  `/${router.query.chainNameAndSafeAddress}/automations/${automation.id}`,
                )
              }}
            />
          ))} */}
        </ul>
      ) : (
        <ul className="px-0 sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4"></ul>
      )}
    </div>
  )
}

export default InvoicesPageContent

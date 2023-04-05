import { ArrowLeft } from "@icons"
import Breakpoint from "@ui/Breakpoint"
import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button } from "@ui/Button"
import RightSlider from "@ui/RightSlider"
import AccountNavBar from "components/core/AccountNavBar"
import InvoiceStatusBar, {
  InvoiceTypeTab,
} from "components/core/TabBars/InvoiceTabBar"
import { InvoiceTabContent } from "components/invoices/InvoiceTabContent"
import NewInvoicesContent from "components/pages/newInvoices/components/NewInvoicesContent"
import DesktopTerminalLayout from "components/terminal/DesktopTerminalLayout"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks/useTerminalByChainIdAndSafeAddress"
import { Terminal } from "models/terminal/types"
import { convertGlobalId } from "models/terminal/utils"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useIsModuleEnabled } from "../../../src/hooks/safe/useIsModuleEnabled"
import { usePermissionsStore } from "../../../src/hooks/stores/usePermissionsStore"
import { useIsSigner } from "../../../src/hooks/useIsSigner"

const TerminalActivationView = dynamic(() =>
  import("components/terminalCreation/import/TerminalActivationView").then(
    (mod) => mod.TerminalActivationView,
  ),
)

const DesktopInvoicesPage = () => {
  const isSigner = usePermissionsStore(
    (state: { isSigner: any }) => state.isSigner,
  )
  const { isMobile } = useBreakpoint()

  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { terminal } = useTerminalByChainIdAndSafeAddress(
    address as string,
    chainId as number,
  )
  const [isCreateInvoiceSliderOpen, setCreateInvoiceSliderOpen] =
    useState<boolean>(false)
  const closeCreateInvoiceSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "createInvoiceSliderOpen")
      setCreateInvoiceSliderOpen(false)
    }
  }

  useEffect(() => {
    if (router.query.createInvoiceSliderOpen) {
      setCreateInvoiceSliderOpen(true)
    }
  }, [router.query])

  return (
    <>
      <RightSlider
        open={isCreateInvoiceSliderOpen}
        setOpen={closeCreateInvoiceSlider}
      >
        <NewInvoicesContent />
      </RightSlider>
      <Head>
        <title>Invoices | {terminal?.data.name}</title>
      </Head>
      <DesktopTerminalLayout>
        <div className="my-4 flex flex-row items-center justify-between px-4 pt-3">
          <span className="text-2xl font-bold">Invoices</span>
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
        <InvoiceStatusBar>
          <InvoiceTabContent filter={InvoiceTypeTab.ALL} />
          <InvoiceTabContent filter={InvoiceTypeTab.PENDING} />
          <InvoiceTabContent filter={InvoiceTypeTab.PAID} />
        </InvoiceStatusBar>
      </DesktopTerminalLayout>
    </>
  )
}

const MobileInvoicesPage = () => {
  const router = useRouter()
  const isSigner = usePermissionsStore((state) => state.isSigner)
  const { isMobile } = useBreakpoint()

  return (
    <>
      <div className="flex h-screen grow flex-col pb-4">
        <AccountNavBar />
        <Link
          href={`/${router.query.chainNameAndSafeAddress}`}
          className="block w-fit px-4"
        >
          <ArrowLeft />
        </Link>
        <div className="my-4 flex flex-row items-center justify-between px-4">
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
        <InvoiceStatusBar>
          <InvoiceTabContent filter={InvoiceTypeTab.ALL} />
          <InvoiceTabContent filter={InvoiceTypeTab.PENDING} />
          <InvoiceTabContent filter={InvoiceTypeTab.PAID} />
        </InvoiceStatusBar>
      </div>
    </>
  )
}

const InvoicesPage = () => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { terminal, mutate: mutateGetTerminal } =
    useTerminalByChainIdAndSafeAddress(address as string, chainId as number)
  const { data: isModuleEnabled, isSuccess } = useIsModuleEnabled({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
  })
  useIsSigner({
    address: address as string,
    chainId: chainId as number,
  })

  const [isOpen, setIsOpen] = useState<boolean>(Boolean(!isModuleEnabled))

  return (
    <>
      {isSuccess && !isModuleEnabled && (
        <TerminalActivationView
          mutateGetTerminal={mutateGetTerminal}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          terminal={terminal as Terminal}
        />
      )}
      <Breakpoint>
        {(isMobile) => {
          if (isMobile) return <MobileInvoicesPage />
          return <DesktopInvoicesPage />
        }}
      </Breakpoint>
    </>
  )
}

export default InvoicesPage

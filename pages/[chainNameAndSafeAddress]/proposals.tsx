import { ArrowLeft } from "@icons"
import Breakpoint from "@ui/Breakpoint"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks/useTerminalByChainIdAndSafeAddress"
import { Terminal } from "models/terminal/types"
import { convertGlobalId } from "models/terminal/utils"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import TerminalRequestTypeTabBar, {
  TerminalRequestTypeTab,
} from "../../src/components/core/TabBars/TerminalRequestTypeTabBar"
import { CreateRequestDropdown } from "../../src/components/request/CreateRequestDropdown"
import RequestTabContent from "../../src/components/request/RequestTabContent"
import DesktopTerminalLayout from "../../src/components/terminal/DesktopTerminalLayout"
import { useIsModuleEnabled } from "../../src/hooks/safe/useIsModuleEnabled"
import { usePermissionsStore } from "../../src/hooks/stores/usePermissionsStore"
import useStore from "../../src/hooks/stores/useStore"
import { useIsSigner } from "../../src/hooks/useIsSigner"

const RequestActionsDrawer = dynamic(() =>
  import("components/request/RequestActions/Drawer").then(
    (mod) => mod.RequestActionsDrawer,
  ),
)
const RequestActionsModal = dynamic(() =>
  import("components/request/RequestActions/Modal").then(
    (mod) => mod.RequestActionsModal,
  ),
)
const TerminalActivationView = dynamic(() =>
  import("components/terminalCreation/import/TerminalActivationView").then(
    (mod) => mod.TerminalActivationView,
  ),
)

const DesktopTerminalRequestsPage = () => {
  const isSigner = usePermissionsStore((state) => state.isSigner)

  const isRequestActionsOpen = useStore((state) => state.isRequestActionsOpen)
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { terminal } = useTerminalByChainIdAndSafeAddress(
    address as string,
    chainId as number,
  )
  const setIsRequestActionsOpen = useStore(
    (state) => state.setIsRequestActionsOpen,
  )
  return (
    <>
      <Head>
        <title>Proposals | {terminal?.data.name}</title>
      </Head>
      <RequestActionsModal
        isOpen={isRequestActionsOpen}
        setIsOpen={setIsRequestActionsOpen}
      />
      <DesktopTerminalLayout>
        <div className="my-4 flex flex-row items-center justify-between px-4 pt-3">
          <span className="text-2xl font-bold">Proposals</span>
          {isSigner && <CreateRequestDropdown />}
        </div>
        <TerminalRequestTypeTabBar>
          <RequestTabContent tab={TerminalRequestTypeTab.ALL} />
          <RequestTabContent tab={TerminalRequestTypeTab.TOKENS} />
          <RequestTabContent tab={TerminalRequestTypeTab.MEMBERS} />
        </TerminalRequestTypeTabBar>
      </DesktopTerminalLayout>
    </>
  )
}

const MobileTerminalRequestsPage = () => {
  const router = useRouter()
  const isSigner = usePermissionsStore((state) => state.isSigner)
  const isRequestActionsOpen = useStore((state) => state.isRequestActionsOpen)
  const setIsRequestActionsOpen = useStore(
    (state) => state.setIsRequestActionsOpen,
  )
  return (
    <>
      <RequestActionsDrawer
        isOpen={isRequestActionsOpen}
        setIsOpen={setIsRequestActionsOpen}
      />
      <div className="flex h-screen grow flex-col pb-4">
        <AccountNavBar />
        <Link
          href={`/${router.query.chainNameAndSafeAddress}`}
          className="block w-fit px-4"
        >
          <ArrowLeft />
        </Link>
        <div className="my-4 flex flex-row items-center justify-between px-4">
          <h1>Proposals</h1>
          {isSigner && <CreateRequestDropdown />}
        </div>
        <TerminalRequestTypeTabBar>
          <RequestTabContent tab={TerminalRequestTypeTab.ALL} />
          <RequestTabContent tab={TerminalRequestTypeTab.TOKENS} />
          <RequestTabContent tab={TerminalRequestTypeTab.MEMBERS} />
        </TerminalRequestTypeTabBar>
      </div>
    </>
  )
}

const TerminalRequestsPage = () => {
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
          if (isMobile) return <MobileTerminalRequestsPage />
          return <DesktopTerminalRequestsPage />
        }}
      </Breakpoint>
    </>
  )
}

export default TerminalRequestsPage

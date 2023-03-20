import Breakpoint from "@ui/Breakpoint/Breakpoint"
import TerminalActivationView from "components/terminalCreation/import/TerminalActivationView"
import { Terminal } from "models/terminal/types"
import Head from "next/head"
import { useState } from "react"
import Desktop from "../../src/components/pages/assets/Desktop"
import Mobile from "../../src/components/pages/assets/Mobile"
import { useIsModuleEnabled } from "../../src/hooks/safe/useIsModuleEnabled"
import { useTerminalByChainIdAndSafeAddress } from "../../src/models/terminal/hooks"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const AssetsPage = () => {
  // router.query doesn't work during pre-rendering unless we are using ssr
  const chainNameAndSafeAddress = decodeURIComponent(
    window.location.pathname.split("/")[1],
  ) as string
  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  const chainId = chainNameToChainId[chainName] as number
  const { terminal, mutate: mutateGetTerminal } =
    useTerminalByChainIdAndSafeAddress(safeAddress, chainId)
  const { data: isModuleEnabled, isSuccess } = useIsModuleEnabled({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
  })
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(!isModuleEnabled))

  return (
    <>
      <>
        <Head>
          <title>Assets | {terminal?.data.name}</title>
        </Head>
      </>
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
          if (isMobile) {
            return <Mobile terminal={terminal as Terminal} />
          }
          return <Desktop terminal={terminal as Terminal} />
        }}
      </Breakpoint>
    </>
  )
}

export default AssetsPage

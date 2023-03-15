import Breakpoint from "@ui/Breakpoint"
import TerminalActivationView from "components/terminalCreation/import/TerminalActivationView"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks/useTerminalByChainIdAndSafeAddress"
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
import { useState } from "react"
import Desktop from "../../../src/components/pages/terminalDetails/Desktop"
import Mobile from "../../../src/components/pages/terminalDetails/Mobile"
import { useIsModuleEnabled } from "../../../src/hooks/safe/useIsModuleEnabled"
import { Terminal } from "../../../src/models/terminal/types"

const TerminalDetailsPage = () => {
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
          if (isMobile) {
            return <Mobile terminal={terminal as Terminal} />
          }
          return <Desktop terminal={terminal as Terminal} />
        }}
      </Breakpoint>
    </>
  )
}

export default TerminalDetailsPage

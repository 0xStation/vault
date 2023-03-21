import Breakpoint from "@ui/Breakpoint"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks/useTerminalByChainIdAndSafeAddress"
import { convertGlobalId } from "models/terminal/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import Desktop from "../../../src/components/pages/terminalDetails/Desktop"
import Mobile from "../../../src/components/pages/terminalDetails/Mobile"
import { useIsModuleEnabled } from "../../../src/hooks/safe/useIsModuleEnabled"
import { useIsSigner } from "../../../src/hooks/useIsSigner"
import { Terminal } from "../../../src/models/terminal/types"

const TerminalActivationView = dynamic(() =>
  import("components/terminalCreation/import/TerminalActivationView").then(
    (mod) => mod.TerminalActivationView,
  ),
)

const TerminalDetailsPage = () => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  useIsSigner({ address: address as string, chainId: chainId as number })

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

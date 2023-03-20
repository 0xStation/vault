import Breakpoint from "@ui/Breakpoint"
import TerminalActivationView from "components/terminalCreation/import/TerminalActivationView"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { Terminal } from "models/terminal/types"
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Desktop from "../../../../src/components/pages/sendTokens/Desktop"
import Mobile from "../../../../src/components/pages/sendTokens/Mobile"
import { useIsModuleEnabled } from "../../../../src/hooks/safe/useIsModuleEnabled"
import { useIsSigner } from "../../../../src/hooks/useIsSigner"

const NewTokensPage = () => {
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
  const isSigner = useIsSigner({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
  })

  useEffect(() => {
    if (!isSigner || !terminal) {
      router.push(`/${router.query.chainNameAndSafeAddress}/members`)
    }
  }, [isSigner])

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
            return <Mobile />
          }
          return <Desktop />
        }}
      </Breakpoint>
    </>
  )
}

export default NewTokensPage

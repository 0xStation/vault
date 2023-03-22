import Breakpoint from "@ui/Breakpoint/Breakpoint"
import { chainNameToChainId } from "lib/constants"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Desktop from "../../../src/components/pages/editMembers/Desktop"
import Mobile from "../../../src/components/pages/editMembers/Mobile"
import { useIsModuleEnabled } from "../../../src/hooks/safe/useIsModuleEnabled"
import { useIsSigner } from "../../../src/hooks/useIsSigner"
import { useTerminalByChainIdAndSafeAddress } from "../../../src/models/terminal/hooks"

const TerminalActivationView = dynamic(() =>
  import("components/terminalCreation/import/TerminalActivationView").then(
    (mod) => mod.TerminalActivationView,
  ),
)

const MembersPage = () => {
  // router.query doesn't work during pre-rendering unless we are using ssr
  const chainNameAndSafeAddress = decodeURIComponent(
    window.location.pathname.split("/")[1],
  ) as string

  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  const chainId = chainNameToChainId[chainName] as number
  const { terminal, mutate: mutateGetTerminal } =
    useTerminalByChainIdAndSafeAddress(safeAddress, chainId)

  const isSigner = useIsSigner({ address: safeAddress, chainId })

  const { data: isModuleEnabled, isSuccess } = useIsModuleEnabled({
    address: terminal?.safeAddress as string,
    chainId: terminal?.chainId as number,
  })
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(!isModuleEnabled))
  const router = useRouter()

  useEffect(() => {
    if (!isSigner || !terminal) {
      router.push(`/${chainNameAndSafeAddress}/members`)
    }
  }, [isSigner])

  if (!terminal) {
    return <></> // TODO: show the 404 page
  }

  return (
    <>
      {isSuccess && !isModuleEnabled && (
        <TerminalActivationView
          mutateGetTerminal={mutateGetTerminal}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          terminal={terminal}
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

export default MembersPage

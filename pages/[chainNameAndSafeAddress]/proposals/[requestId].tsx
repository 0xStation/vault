import Breakpoint from "@ui/Breakpoint"
import { useTerminalByChainIdAndSafeAddress } from "models/terminal/hooks"
import { Terminal } from "models/terminal/types"
import { convertGlobalId } from "models/terminal/utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useState } from "react"
import Desktop from "../../../src/components/pages/requestDetails/Desktop"
import Mobile from "../../../src/components/pages/requestDetails/Mobile"
import { useIsModuleEnabled } from "../../../src/hooks/safe/useIsModuleEnabled"

const TerminalActivationView = dynamic(() =>
  import("components/terminalCreation/import/TerminalActivationView").then(
    (mod) => mod.TerminalActivationView,
  ),
)

const TerminalRequestIdPage = () => {
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
            return <Mobile />
          }
          return <Desktop />
        }}
      </Breakpoint>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { requestId, chainNameAndSafeAddress } = context.query
  const userAgent = context.req.headers["user-agent"]
  const isMobile = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  )

  if (!isMobile) {
    return {
      redirect: {
        destination: `/${chainNameAndSafeAddress}/proposals?requestId=${requestId}`,
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}

export default TerminalRequestIdPage

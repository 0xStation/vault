import Breakpoint from "@ui/Breakpoint"
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
import Desktop from "../../../src/components/pages/automations/Desktop"
import Mobile from "../../../src/components/pages/automations/Mobile"
import { useIsSigner } from "../../../src/hooks/useIsSigner"

const AutomationsPage = () => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  useIsSigner({ chainId: chainId as number, address: address as string })
  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) {
          return <Mobile />
        }
        return <Desktop />
      }}
    </Breakpoint>
  )
}

export default AutomationsPage

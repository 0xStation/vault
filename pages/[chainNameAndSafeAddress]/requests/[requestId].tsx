import Breakpoint from "@ui/Breakpoint"
import Desktop from "../../../src/components/pages/requestDetails/Desktop"
import Mobile from "../../../src/components/pages/requestDetails/Mobile"

const TerminalRequestIdPage = () => {
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

export default TerminalRequestIdPage

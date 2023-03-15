import Breakpoint from "@ui/Breakpoint"
import Desktop from "../../../src/components/pages/automations/Desktop"
import Mobile from "../../../src/components/pages/automations/Mobile"

const AutomationsPage = ({}: {}) => {
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

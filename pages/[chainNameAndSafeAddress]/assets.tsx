import Breakpoint from "@ui/Breakpoint/Breakpoint"
import Desktop from "../../src/components/pages/assets/Desktop"
import Mobile from "../../src/components/pages/assets/Mobile"

const MembersPage = () => {
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

export default MembersPage

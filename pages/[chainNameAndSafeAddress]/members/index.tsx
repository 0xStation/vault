import Breakpoint from "@ui/Breakpoint/Breakpoint"
import Desktop from "../../../src/components/pages/members/Desktop"
import Mobile from "../../../src/components/pages/members/Mobile"

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

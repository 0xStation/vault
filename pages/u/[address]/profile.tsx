import Breakpoint from "@ui/Breakpoint"
import Desktop from "../../../src/components/pages/profile/Desktop"
import Mobile from "../../../src/components/pages/profile/Mobile"

const ProfilePage = ({}: {}) => {
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

export default ProfilePage

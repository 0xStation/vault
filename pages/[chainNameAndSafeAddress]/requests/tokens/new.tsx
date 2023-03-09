import Breakpoint from "@ui/Breakpoint"
import Desktop from "../../../../src/components/pages/sendTokens/Desktop"
import Mobile from "../../../../src/components/pages/sendTokens/Mobile"

const NewTokensPage = () => {
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

export default NewTokensPage

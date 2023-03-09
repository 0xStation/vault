import { Terminal } from "../../../models/terminal/types"
import DesktopTerminalLayout from "../../terminal/DesktopTerminalLayout"
import MembersPageContent from "./components/MembersPageContent"

const Desktop = ({ terminal }: { terminal: Terminal }) => {
  return (
    <DesktopTerminalLayout terminal={terminal}>
      <MembersPageContent />
    </DesktopTerminalLayout>
  )
}

export default Desktop

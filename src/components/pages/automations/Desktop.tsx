import { Terminal } from "../../../../src/models/terminal/types"
import DesktopTerminalLayout from "../../terminal/DesktopTerminalLayout"
import AutomationsPageContent from "./components/AutomationsPageContent"

const Desktop = ({ terminal }: { terminal: Terminal }) => {
  return (
    <DesktopTerminalLayout terminal={terminal}>
      <AutomationsPageContent />
    </DesktopTerminalLayout>
  )
}

export default Desktop

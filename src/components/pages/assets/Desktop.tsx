import { Terminal } from "../../../models/terminal/types"
import DesktopTerminalLayout from "../../terminal/DesktopTerminalLayout"
import AssetsPageContent from "./components/AssetPageContent"

const Desktop = ({ terminal }: { terminal: Terminal }) => {
  return (
    <DesktopTerminalLayout terminal={terminal}>
      <AssetsPageContent terminal={terminal} />
    </DesktopTerminalLayout>
  )
}

export default Desktop

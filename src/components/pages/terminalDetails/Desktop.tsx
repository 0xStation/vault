import { EditButton } from "components/core/EditButton"
import { Terminal } from "../../../../src/models/terminal/types"
import { usePermissionsStore } from "../../../hooks/stores/usePermissionsStore"
import {
  Sliders,
  useSliderManagerStore,
} from "../../../hooks/stores/useSliderManagerStore"
import DesktopTerminalLayout from "../../terminal/DesktopTerminalLayout"
import TerminalDetailsPageContent from "./components/TerminalDetailsPageContent"

const Desktop = ({ terminal }: { terminal: Terminal }) => {
  const isSigner = usePermissionsStore((state) => state.isSigner)
  const setActiveSlider = useSliderManagerStore(
    (state) => state.setActiveSlider,
  )

  return (
    <>
      <DesktopTerminalLayout>
        {isSigner && (
          <>
            <div className="absolute right-[48px] top-[72px]">
              <EditButton
                onClick={() => setActiveSlider(Sliders.EDIT_TERMINAL_DETAILS)}
                className="rounded border border-gray-80"
              />
            </div>
          </>
        )}
        <TerminalDetailsPageContent terminal={terminal} />
      </DesktopTerminalLayout>
    </>
  )
}

export default Desktop

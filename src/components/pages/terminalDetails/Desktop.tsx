import { EditButton } from "components/core/EditButton"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Terminal } from "../../../../src/models/terminal/types"
import { usePermissionsStore } from "../../../hooks/stores/usePermissionsStore"
import {
  addQueryParam,
  removeQueryParam,
} from "../../../lib/utils/updateQueryParam"
import DesktopTerminalLayout from "../../terminal/DesktopTerminalLayout"
import EditTerminalContent from "../editTerminalDetails/components/EditTerminalContent"
import TerminalDetailsPageContent from "./components/TerminalDetailsPageContent"

const RightSlider = dynamic(() =>
  import("../../ui/RightSlider").then((mod) => mod.RightSlider),
)

const Desktop = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()
  const [editDetailsSliderOpen, setEditSliderOpen] = useState<boolean>(false)
  const isSigner = usePermissionsStore((state) => state.isSigner)
  const toggleDetailsSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "editDetails")
    }
  }

  useEffect(() => {
    if (isSigner && "editDetails" in router.query) {
      setEditSliderOpen(true)
    } else {
      setEditSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <DesktopTerminalLayout>
        {isSigner && (
          <>
            <RightSlider
              open={editDetailsSliderOpen}
              setOpen={toggleDetailsSlider}
            >
              <EditTerminalContent />
            </RightSlider>
            <div className="absolute right-[48px] top-[72px]">
              <EditButton
                onClick={() => addQueryParam(router, "editDetails", "true")}
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

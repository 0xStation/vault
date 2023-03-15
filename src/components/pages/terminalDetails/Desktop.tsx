import { PencilIcon } from "@heroicons/react/24/solid"
import RightSlider from "@ui/RightSlider"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Terminal } from "../../../../src/models/terminal/types"
import {
  addQueryParam,
  removeQueryParam,
} from "../../../lib/utils/updateQueryParam"
import DesktopTerminalLayout from "../../terminal/DesktopTerminalLayout"
import EditTerminalContent from "../editTerminalDetails/components/EditTerminalContent"
import TerminalDetailsPageContent from "./components/TerminalDetailsPageContent"

const EditButton = ({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} h-fit p-2 hover:bg-gray-80`}
    >
      <PencilIcon className="w-2.5" />
    </button>
  )
}

const Desktop = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  const [editDetailsSliderOpen, setEditSliderOpen] = useState<boolean>(false)
  const toggleDetailsSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "editDetails")
    }
  }

  useEffect(() => {
    if ("editDetails" in router.query) {
      setEditSliderOpen(true)
    } else {
      setEditSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <DesktopTerminalLayout>
        <RightSlider open={editDetailsSliderOpen} setOpen={toggleDetailsSlider}>
          <EditTerminalContent />
        </RightSlider>
        <div className="absolute right-[48px] top-[72px]">
          <EditButton
            onClick={() => addQueryParam(router, "editDetails", "true")}
            className="rounded border border-gray-80"
          />
        </div>
        <TerminalDetailsPageContent terminal={terminal} />
      </DesktopTerminalLayout>
    </>
  )
}

export default Desktop

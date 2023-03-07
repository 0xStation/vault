import truncateString from "lib/utils"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { VIEW } from "../../../pages/terminal/new"
import { useTerminalCreationStore } from "../../hooks/stores/useTerminalCreationStore"
import SelectorCard from "../core/SelectorCard"

const MetadataPill = ({ children }: { children: ReactNode }) => {
  return (
    <span className="mr-3 flex h-fit w-fit flex-row rounded-full bg-slate-50 py-1 px-2">
      {children}
    </span>
  )
}

export const ExistingSafeCard = ({
  safeAddress,
  setView,
  setSelectedAddress,
  setDrawerOpen,
}: {
  chainId: number
  safeAddress: string
  setView: Dispatch<SetStateAction<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>>
  setSelectedAddress: Dispatch<SetStateAction<string>>
  setDrawerOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)

  return (
    <SelectorCard
      className="mb-2"
      onClick={() => {
        setFormData({ ...formData, address: safeAddress })
        setView(VIEW.CREATE_FORM)
      }}
    >
      <div className="flex flex-row justify-between">
        <p className="font-bold">{truncateString(safeAddress)}</p>
        <button
          className="text-xs text-violet"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedAddress(safeAddress)
            setDrawerOpen(true)
          }}
        >
          View details
        </button>
      </div>
    </SelectorCard>
  )
}

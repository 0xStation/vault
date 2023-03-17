import LoadingSpinner from "@ui/LoadingSpinner"
import { Network } from "@ui/Network"
import truncateString from "lib/utils"
import { Dispatch, SetStateAction, useState } from "react"
import { VIEW } from "../../../pages/project/new"
import { useSafeMetadata } from "../../hooks/safe/useSafeMetadata"
import { useTerminalCreationStore } from "../../hooks/stores/useTerminalCreationStore"
import SelectorCard from "../core/SelectorCard"

export const ExistingSafeCard = ({
  chainId,
  safeAddress,
  setView,
}: {
  chainId: number
  safeAddress: string
  setView: Dispatch<SetStateAction<VIEW.CREATION_OPTIONS | VIEW.CREATE_FORM>>
}) => {
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const setFormData = useTerminalCreationStore((state) => state.setFormData)
  const formData = useTerminalCreationStore((state) => state.formData)
  const { safeMetadata, isLoading: isSafeMetadataLoading } = useSafeMetadata({
    address: selectedAddress,
    chainId: chainId,
  })

  const plural =
    safeMetadata?.signers?.length && safeMetadata?.signers?.length === 1
      ? ""
      : "s"

  return (
    <SelectorCard
      className="mb-2"
      onClick={() => {
        setFormData({ ...formData, address: safeAddress })
        setView(VIEW.CREATE_FORM)
      }}
    >
      <div className="flex flex-col">
        <p className="font-bold">{truncateString(safeAddress)}</p>
        {isSafeMetadataLoading ? (
          <LoadingSpinner />
        ) : safeMetadata ? (
          <p className="mt-1 flex flex-row text-sm text-gray">
            <Network chainId={chainId} />
            &nbsp;· {safeMetadata?.signers?.length}
            &nbsp;member{plural}
          </p>
        ) : (
          <button
            className="w-fit text-sm text-violet"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedAddress(safeAddress)
            }}
          >
            View details
          </button>
        )}
      </div>
    </SelectorCard>
  )
}

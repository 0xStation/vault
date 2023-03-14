import { UserGroupIcon } from "@heroicons/react/24/outline"
import BottomDrawer from "@ui/BottomDrawer"
import truncateString from "lib/utils"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { useGetSafeBalance } from "../../hooks/safe/useSafeBalance"
import { useSafeMetadata } from "../../hooks/safe/useSafeMetadata"

const MetadataPill = ({ children }: { children: ReactNode }) => {
  return (
    <span className="mr-3 flex h-fit w-fit flex-row rounded-full bg-gray-90 py-1 px-2">
      {children}
    </span>
  )
}

export const SafeDetailsDrawer = ({
  isOpen,
  setIsOpen,
  safeAddress,
  chainId,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  safeAddress: string
  chainId: number
}) => {
  const { safeMetadata, isLoading: isSafeMetadataLoading } = useSafeMetadata({
    address: safeAddress,
    chainId,
  })
  const { balanceData, isLoading: isSafeBalanceLoading } = useGetSafeBalance({
    address: safeAddress,
    chainId,
  })

  const accBalanceData = balanceData.reduce((acc, balance) => {
    return parseFloat(balance.fiatBalance) + acc
  }, 0)

  return (
    <BottomDrawer size="xs" isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1>{truncateString(safeAddress)}</h1>
      {isSafeMetadataLoading || isSafeBalanceLoading ? (
        <div className="mt-3 flex flex-row">
          <span className="mr-3 flex h-[32px] w-[50px] animate-pulse rounded-full bg-gray-80 py-1 px-2" />
          <span className="mr-3 flex h-[32px] w-[50px] animate-pulse rounded-full bg-gray-80 py-1 px-2" />
        </div>
      ) : (
        <div className="mt-3 flex flex-row">
          <MetadataPill>
            <UserGroupIcon className="mr-2 h-5 w-5" />
            <p>{safeMetadata?.signers?.length}</p>
          </MetadataPill>
          <MetadataPill>
            <p>${accBalanceData.toFixed(2)}</p>
          </MetadataPill>
        </div>
      )}
    </BottomDrawer>
  )
}

import { PencilIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/router"
import { useState } from "react"
import AccountNavBar from "../../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import { UpdateMembersDrawer } from "../../../src/components/members/UpdateMembersDrawer"
import { useSafeMetadata } from "../../../src/hooks/safe/useSafeMetadata"
import { useGetNextNonce } from "../../../src/hooks/useGetNextNonce"
import { convertGlobalId } from "../../../src/models/terminal/utils"

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
      className={`${className} h-fit p-2 hover:bg-slate-200`}
    >
      <PencilIcon className="w-2.5" />
    </button>
  )
}

const MembersPage = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  const { chainId, address } = convertGlobalId(
    chainNameAndSafeAddress as string,
  )
  const [isUpdateMembersDrawerOpen, setUpdateMembersDrawerOpen] =
    useState<boolean>(false)

  const { safeMetadata } = useSafeMetadata({
    chainId: chainId as number,
    address: address as string,
  })

  const nextNonce = useGetNextNonce({
    chainId: chainId as number,
    address: address as string,
  })

  return (
    <>
      <AccountNavBar />
      <UpdateMembersDrawer
        isOpen={isUpdateMembersDrawerOpen}
        setIsOpen={setUpdateMembersDrawerOpen}
        safeMetadata={safeMetadata}
      />
      <div className="mt-2 w-full px-4">
        <div className="flex flex-row justify-between">
          <h2 className="mb-6 font-bold">Members</h2>
          <EditButton
            onClick={() => setUpdateMembersDrawerOpen(true)}
            className="rounded border border-slate-200"
          />
        </div>
        <div>
          {safeMetadata?.signers?.map((signerAddress) => (
            <div key={signerAddress} className="flex flex-row">
              <AvatarAddress
                size="sm"
                address={signerAddress}
                className="mb-2"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-sm font-bold">Quorum</p>
          <p className="mt-2">
            {safeMetadata?.quorum}/{safeMetadata?.signers?.length}
          </p>
        </div>
      </div>
    </>
  )
}

export default MembersPage

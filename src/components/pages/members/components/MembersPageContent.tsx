import { PencilIcon } from "@heroicons/react/24/solid"
import Breakpoint from "@ui/Breakpoint"
import { Button } from "@ui/Button"
import RightSlider from "@ui/RightSlider"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useGetSignerQuorumRequestChanges } from "../../../..//hooks/useGetSignerQuorumRequestChanges"
import { convertGlobalId } from "../../../..//models/terminal/utils"
import { useSafeMetadata } from "../../../../hooks/safe/useSafeMetadata"
import { usePermissionsStore } from "../../../../hooks/stores/usePermissionsStore"
import { AvatarAddress } from "../../../core/AvatarAddress"
import EditMembersContent from "../../editMembers/components/EditMembersContent"

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
      <PencilIcon className="w-4" />
    </button>
  )
}

const MembersPageContent = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  const { chainId, address } = convertGlobalId(
    chainNameAndSafeAddress as string,
  )
  const isSigner = usePermissionsStore((state) => state.isSigner)

  const { safeMetadata } = useSafeMetadata({
    chainId: chainId as number,
    address: address as string,
  })

  const { data } = useGetSignerQuorumRequestChanges({
    chainId: chainId as number,
    address: address as string,
    currentQuorum: safeMetadata?.quorum as number,
  })

  const [editMembersOpen, setEditMembersOpen] = useState<boolean>(false)
  const closeEditMembersSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "editMembers")
    }
  }

  useEffect(() => {
    if (router.query.editMembers && isSigner) {
      setEditMembersOpen(true)
    } else {
      setEditMembersOpen(false)
    }
  }, [router.query, isSigner])

  return (
    <>
      <RightSlider open={editMembersOpen} setOpen={closeEditMembersSlider}>
        <EditMembersContent />
      </RightSlider>
      <div className="mt-6 w-full px-4">
        <div className="mb-6 flex flex-row items-center justify-between">
          <h1>Members</h1>
          {isSigner && (
            <div className="flex flex-row">
              <Breakpoint>
                {(isMobile) => {
                  if (isMobile) {
                    return (
                      <Button
                        size="base"
                        onClick={() =>
                          router.push(
                            `/${chainNameAndSafeAddress}/members/edit`,
                          )
                        }
                      >
                        + Add
                      </Button>
                    )
                  }
                  return (
                    <Button
                      size="base"
                      onClick={() => {
                        addQueryParam(router, "editMembers", "true")
                      }}
                    >
                      + Add
                    </Button>
                  )
                }}
              </Breakpoint>

              <Breakpoint>
                {(isMobile) => {
                  if (isMobile) {
                    return (
                      <EditButton
                        onClick={() =>
                          router.push(
                            `/${chainNameAndSafeAddress}/members/edit`,
                          )
                        }
                        className="ml-2 rounded border border-gray-80"
                      />
                    )
                  }
                  return (
                    <EditButton
                      onClick={() =>
                        addQueryParam(router, "editMembers", "true")
                      }
                      className="ml-2 rounded border border-gray-80"
                    />
                  )
                }}
              </Breakpoint>
            </div>
          )}
        </div>
        <div>
          {safeMetadata?.signers?.map((signerAddress) => {
            const activeRequest =
              data?.modifiedChangesToRequests?.modifiedAddresses?.[
                signerAddress
              ]
            return (
              <div
                key={signerAddress}
                className="mb-2 flex flex-row justify-between"
              >
                <AvatarAddress
                  size="sm"
                  address={signerAddress}
                  className={`${
                    activeRequest?.length ? "opacity-70" : "opacity-100"
                  }`}
                />

                {activeRequest?.length ? (
                  <p className="flex items-center text-sm text-gray">
                    Pending removal ·&nbsp;
                    <a
                      className="text-sm text-white underline decoration-dotted"
                      href={`/${chainNameAndSafeAddress}/proposals/${activeRequest[0]}`}
                    >
                      View proposal
                    </a>
                  </p>
                ) : null}
              </div>
            )
          })}
          {/* Pending new members */}
          {data?.modifiedChangesToRequests?.modifiedAddresses &&
            Object.entries(
              data?.modifiedChangesToRequests?.modifiedAddresses,
            ).map(([key, requestIds]) => {
              return !safeMetadata?.signers?.includes(key) ? (
                <div key={key} className="mb-2 flex flex-row justify-between">
                  <AvatarAddress
                    size="sm"
                    address={key}
                    className={`${
                      (requestIds as string[])?.length
                        ? "opacity-70"
                        : "opacity-100"
                    }`}
                  />

                  {(requestIds as string[])?.length ? (
                    <p className="flex items-center text-sm text-gray">
                      Pending entry ·&nbsp;
                      <a
                        className="text-sm text-white underline decoration-dotted"
                        href={`/${chainNameAndSafeAddress}/proposals/${
                          (requestIds as string[])?.[0]
                        }`}
                      >
                        View proposal
                      </a>
                    </p>
                  ) : null}
                </div>
              ) : null
            })}
        </div>
        <div className="mt-4">
          <p className="text-base font-bold">Quorum</p>
          <div className="flex flex-row justify-between">
            <p className="mt-2">
              {safeMetadata?.quorum}/{safeMetadata?.signers?.length}
            </p>
            {data?.modifiedChangesToRequests?.modifiedQuorum?.length ? (
              <p className="text-sm text-gray">
                Pending update ·&nbsp;
                <a
                  className="text-sm text-white underline decoration-dotted"
                  href={`/${chainNameAndSafeAddress}/proposals/${data?.modifiedChangesToRequests?.modifiedQuorum?.[0]}`}
                >
                  View proposal
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default MembersPageContent

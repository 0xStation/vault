import { PencilIcon } from "@heroicons/react/24/solid"
import { Button } from "@ui/Button"
import { useRouter } from "next/router"
import { useGetSignerQuorumRequestChanges } from "../../../..//hooks/useGetSignerQuorumRequestChanges"
import { convertGlobalId } from "../../../..//models/terminal/utils"
import { useSafeMetadata } from "../../../../hooks/safe/useSafeMetadata"
import { AvatarAddress } from "../../../core/AvatarAddress"

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

  const { safeMetadata } = useSafeMetadata({
    chainId: chainId as number,
    address: address as string,
  })

  const { data } = useGetSignerQuorumRequestChanges({
    chainId: chainId as number,
    address: address as string,
    currentQuorum: safeMetadata?.quorum as number,
  })

  return (
    <>
      <div className="mt-6 w-full px-4">
        <div className="mb-6 flex flex-row items-center justify-between">
          <h2 className="font-bold">Members</h2>
          <div className="flex flex-row">
            <Button
              size="base"
              onClick={() =>
                router.push(`/${chainNameAndSafeAddress}/members/edit`)
              }
            >
              + Add
            </Button>
            <EditButton
              onClick={() =>
                router.push(`/${chainNameAndSafeAddress}/members/edit`)
              }
              className="ml-2 rounded border border-gray-80"
            />
          </div>
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
                    Pending entry ·&nbsp;
                    <a
                      className="text-sm text-white underline decoration-dotted"
                      href={`/${chainNameAndSafeAddress}/proposals/${activeRequest[0]}`}
                    >
                      View request
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
                        View request
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
                  View request
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

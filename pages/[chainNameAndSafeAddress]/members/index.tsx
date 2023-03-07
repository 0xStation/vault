import { PencilIcon } from "@heroicons/react/24/solid"
import { ArrowLeft } from "@icons"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountNavBar from "../../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import { useSafeMetadata } from "../../../src/hooks/safe/useSafeMetadata"
import { useGetSignerQuorumRequestChanges } from "../../../src/hooks/useGetSignerQuorumRequestChanges"
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

const AddButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="h-[28px] rounded border border-slate-900 bg-slate-900 px-2 text-sm font-medium text-white"
    >
      + Add
    </button>
  )
}

const MembersPage = () => {
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
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <div className="mt-4 w-full px-4">
        <div className="flex flex-row justify-between">
          <h2 className="mb-6 font-bold">Members</h2>
          <div className="items-center">
            <AddButton
              onClick={() =>
                router.push(`/${chainNameAndSafeAddress}/members/edit`)
              }
            />
            <EditButton
              onClick={() =>
                router.push(`/${chainNameAndSafeAddress}/members/edit`)
              }
              className="ml-2 rounded border border-slate-200"
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
                  <p className="flex items-center text-xs text-slate-500">
                    Pending entry · {"  "}
                    <a
                      className="text-xs text-black underline decoration-dotted"
                      href={`/${chainNameAndSafeAddress}/requests/${activeRequest[0]}`}
                    >
                      View request
                    </a>
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
        <div className="mt-4">
          <p className="text-sm font-bold">Quorum</p>
          <div className="flex flex-row justify-between">
            <p className="mt-2">
              {safeMetadata?.quorum}/{safeMetadata?.signers?.length}
            </p>
            {data?.modifiedChangesToRequests?.modifiedQuorum?.length ? (
              <p className="text-xs text-slate-500">
                Pending update · {"  "}
                <a
                  className="text-xs text-black underline decoration-dotted"
                  href={`/${chainNameAndSafeAddress}/requests/${data?.modifiedChangesToRequests?.modifiedQuorum?.[0]}`}
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

export default MembersPage

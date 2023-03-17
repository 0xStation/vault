import { RequestVariantType } from "@prisma/client"
import { WaitRequestExecution } from "components/request/WaitRequestExecution"
import { timeSince } from "lib/utils"
import { useAccount } from "wagmi"
import { NewCommentForm } from "../../../../components/comment/NewCommentForm"
import ActivityItem from "../../../../components/core/ActivityItem"
import { AvatarAddress } from "../../../../components/core/AvatarAddress"
import { SignerQuorumRequestContent } from "../../../../components/request/SignerQuorumRequestContent"
import { TokenTransferRequestContent } from "../../../../components/request/TokenTransferRequestContent"
import { RequestFrob } from "../../../../models/request/types"
import { isExecuted } from "../../../../models/request/utils"
import { RequestDetailsActions } from "../../../request/ReqeustDetailsActions"
import { RequestStatusIcon } from "../../../request/RequestStatusIcon"

const RequestDetailsContent = ({
  request,
  mutateRequest,
}: {
  request: RequestFrob
  mutateRequest: ({
    fn,
    requestId,
    payload,
  }: {
    fn: Promise<any>
    requestId: string
    payload: any
  }) => void
}) => {
  const { address } = useAccount()

  if (!request) {
    return <></>
  }

  const showVoteExecuteButtons =
    request.signers?.includes(address as string) && !isExecuted(request)

  return (
    <>
      <WaitRequestExecution request={request} mutateRequest={mutateRequest} />
      <div className="divide-y divide-gray-90 pb-32">
        <section className="space-y-6 p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-3">
              <RequestStatusIcon status={request.status} />
              {request ? (
                <AvatarAddress size="sm" address={request?.data.createdBy} />
              ) : (
                <></>
              )}
            </div>
            <span className="ml-3 shrink-0 self-start text-sm text-gray">
              {timeSince(request?.createdAt || new Date())}
            </span>
          </div>
          <h3 className="max-w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap">
            {request?.data?.note}
          </h3>
          <div className="space-y-2">
            {request?.variant === RequestVariantType.TOKEN_TRANSFER && (
              <TokenTransferRequestContent request={request} />
            )}
            {request?.variant === RequestVariantType.SIGNER_QUORUM && (
              <SignerQuorumRequestContent request={request} />
            )}
          </div>
        </section>
        <section className="p-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-regular">Votes</h2>
            <span className="text-sm text-gray-50">
              <span className="font-bold">Quorum:</span> {request?.quorum}
            </span>
          </div>
          <h4 className="mt-2 mb-1 text-sm text-gray-50">
            Approved ({request?.approveActivities?.length})
          </h4>
          {request?.approveActivities?.map((activity, idx) => {
            return (
              <AvatarAddress
                key={`approval-Account-${idx}`}
                className="mt-2"
                size="sm"
                address={activity.address}
              />
            )
          })}

          <h4 className="mt-4 text-sm text-gray-50">
            Rejected ({request?.rejectActivities?.length})
          </h4>
          {request?.rejectActivities?.map((activity, idx) => {
            return (
              <AvatarAddress
                key={`rejection-Account-${idx}`}
                className="mt-1"
                size="sm"
                address={activity.address}
              />
            )
          })}
          <h4 className="mt-4 text-sm text-gray-50">
            Has not voted ({request?.addressesThatHaveNotSigned?.length})
          </h4>
          {request?.addressesThatHaveNotSigned?.map((address, idx) => {
            return (
              <AvatarAddress
                key={`waiting-signature-from-${idx}`}
                className="mt-1"
                size="sm"
                address={address}
              />
            )
          })}
        </section>
        <section className="p-4">
          <h2 className="font-regular mb-6">Activity</h2>
          <div className="space-y-2">
            <ul className="space-y-2">
              {request?.activities?.map((activity, idx) => (
                <ActivityItem
                  key={`activity-${idx}`}
                  activity={activity}
                  chainId={request.chainId}
                  mutateRequest={(
                    fn: Promise<any>,
                    update: {
                      activityId: string
                      comment: string
                    },
                  ) => {
                    mutateRequest({
                      fn,
                      requestId: request.id,
                      payload: {
                        ...request!,
                        activities: request!.activities.map((a) => {
                          if (update.activityId !== a.id) {
                            return a
                          }
                          return {
                            ...a,
                            data: {
                              comment: update.comment,
                              edited: true,
                            },
                          }
                        }),
                      },
                    })
                  }}
                />
              ))}
            </ul>
            <NewCommentForm
              mutateRequest={(fn: Promise<any>, commentActivity: any) => {
                mutateRequest({
                  fn: fn,
                  requestId: request.id,
                  payload: {
                    ...request!,
                    activities: [...request!.activities, commentActivity],
                    commentActivities: [
                      commentActivity,
                      ...request!.commentActivities,
                    ],
                  },
                })
              }}
            />
          </div>
        </section>
      </div>
      {/* updating status on transaction success handled elsewhere, can remove this when execution pending */}
      {showVoteExecuteButtons && (
        <RequestDetailsActions
          request={request}
          mutateRequest={mutateRequest}
        />
      )}
    </>
  )
}

export default RequestDetailsContent

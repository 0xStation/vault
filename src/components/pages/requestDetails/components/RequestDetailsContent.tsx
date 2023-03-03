import { ActionStatus, RequestVariantType } from "@prisma/client"

import { NewCommentForm } from "../../../../components/comment/NewCommentForm"
import ActivityItem from "../../../../components/core/ActivityItem"
import { AvatarAddress } from "../../../../components/core/AvatarAddress"
import { CastYourVote } from "../../../../components/request/CastYourVote"
import { ExecuteAction } from "../../../../components/request/ExecuteAction"
import { SignerQuorumRequestContent } from "../../../../components/request/SignerQuorumRequestContent"
import { TokenTransferRequestContent } from "../../../../components/request/TokenTransferRequestContent"
import { timeSince } from "../../../../lib/utils"
import { Action } from "../../../../models/action/types"
import { RequestFrob } from "../../../../models/request/types"

const RequestDetailsContent = ({
  request,
  mutate,
}: {
  request: RequestFrob
  mutate: any
}) => {
  if (!request) {
    return <></>
  }

  const canExecute =
    request.rejectActivities.length >= request.quorum ||
    request.approveActivities.length >= request.quorum

  const activeActions = request.actions.some((action: Action, idx: number) => {
    return action.status !== ActionStatus.NONE
  })

  return (
    <>
      {/* TODO: max-w-[580px] is shrinking to mobile size for easier demoing, remove breakpointed classnames when doing actual desktop implementation */}
      <div className="divide-y divide-slate-200">
        <section className="space-y-3 p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-3">
              <span className="block h-4 min-h-[1rem] w-4 min-w-[1rem] rounded-full bg-violet"></span>
              {request ? (
                <AvatarAddress size="sm" address={request?.data.createdBy} />
              ) : (
                <></>
              )}
            </div>
            <span className="ml-3 shrink-0 self-start text-xs text-slate-500">
              {timeSince(request?.createdAt || new Date())}
            </span>
          </div>
          <h3 className="max-w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap">
            {request?.data?.note}
          </h3>
          {request?.variant === RequestVariantType.TOKEN_TRANSFER && (
            <TokenTransferRequestContent request={request} />
          )}
          {request?.variant === RequestVariantType.SIGNER_QUORUM && (
            <SignerQuorumRequestContent request={request} />
          )}
        </section>
        <section className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3>Votes</h3>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-sm">
              <span className="font-bold">Quorum:</span> {request?.quorum}
            </span>
          </div>
          <h4 className="mt-2 text-xs font-bold">
            Approved ({request?.approveActivities?.length})
          </h4>
          {request?.approveActivities?.map((activity, idx) => {
            return (
              <AvatarAddress
                key={`approval-Account-${idx}`}
                className="mt-1"
                size="sm"
                address={activity.address}
              />
            )
          })}

          <h4 className="mt-3 text-xs font-bold">
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
          <h4 className="mt-3 text-xs font-bold">
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
        <section className="p-4 pb-28">
          <h3 className="mb-4">Timeline</h3>
          <ul className="space-y-3">
            {request?.activities?.map((activity, idx) => (
              <ActivityItem
                activity={activity}
                key={`activity-${idx}`}
                optimisticEditComment={(update: {
                  activityId: string
                  comment: string
                }) => {
                  mutate({
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
                  })
                }}
              />
            ))}
          </ul>
          <NewCommentForm
            optimisticAddComment={(commentActivity) => {
              mutate({
                ...request!,
                activities: [...request!.activities, commentActivity],
                commentActivities: [
                  commentActivity,
                  ...request!.commentActivities,
                ],
              })
            }}
          />
        </section>
      </div>
      <div className={`${activeActions ? "hidden" : "block"}`}>
        {canExecute ? (
          <ExecuteAction
            title="Execute Approval"
            subtitle="This action is on-chain and will not be reversible."
            request={request}
            mutate={mutate}
          />
        ) : (
          <CastYourVote request={request} optimisticVote={mutate} />
        )}
      </div>
    </>
  )
}

export default RequestDetailsContent

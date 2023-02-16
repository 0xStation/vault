import { ActivityVariant } from "@prisma/client"
import { Activity } from "../activity/types"
import { Request, RequestFrob } from "./types"

const toFrob = async (request: Request) => {
  // TODO:
  // get the quorum of the terminal
  const quorum = 2

  const votingActivities = (await prisma.activity.findMany({
    where: {
      requestId: request.id,
      variant: {
        in: [ActivityVariant.APPROVE_REQUEST, ActivityVariant.REJECT_REQUEST],
      },
    },
    distinct: ["accountId"],
    orderBy: {
      createdAt: "desc",
    },
  })) as Activity[]

  type VoteActivityMap = {
    approveActivities: Activity[]
    rejectActivities: Activity[]
  }
  const sortedVotingActivities = votingActivities.reduce(
    (map: VoteActivityMap, vote: Activity) => {
      if (vote.variant === ActivityVariant.APPROVE_REQUEST) {
        map.approveActivities.push(vote)
      } else {
        map.rejectActivities.push(vote)
      }
      return map
    },
    {
      approveActivities: [],
      rejectActivities: [],
    },
  )

  return {
    ...request,
    ...sortedVotingActivities,
    quorum: quorum,
  } as RequestFrob
}

enum VotingStatus {
  VOTING,
  READY_TO_EXECUTE,
  EXECUCTED,
}

export default toFrob

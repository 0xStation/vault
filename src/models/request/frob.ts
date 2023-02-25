import { ActivityVariant } from "@prisma/client"
import { getSafeDetails } from "lib/api/safe/getSafeDetails"
import { Activity } from "../activity/types"
import { Request, RequestFrob } from "./types"

const toFrob = async (request: Request) => {
  const terminal = await prisma.terminal.findFirst({
    where: {
      safeAddress: request.terminalAddress,
      chainId: request.chainId,
    },
  })

  if (!terminal) {
    // error?
    return
  }

  const safeDetails = await getSafeDetails(
    terminal.chainId,
    terminal.safeAddress,
  )

  const quorum = safeDetails?.quorum
  const signers = safeDetails?.signers

  const executingActivites = await prisma.activity.findMany({
    where: {
      requestId: request.id,
      variant: {
        in: [ActivityVariant.EXECUTE_REQUEST],
      },
    },
  })

  const commentActivities = await prisma.activity.findMany({
    where: {
      requestId: request.id,
      variant: {
        in: [ActivityVariant.COMMENT_ON_REQUEST],
      },
    },
  })

  const votingActivities = (await prisma.activity.findMany({
    where: {
      requestId: request.id,
      variant: {
        in: [
          ActivityVariant.APPROVE_REQUEST,
          ActivityVariant.CREATE_AND_APPROVE_REQUEST,
          ActivityVariant.REJECT_REQUEST,
        ],
      },
    },
    distinct: ["address"],
    orderBy: {
      createdAt: "desc",
    },
  })) as Activity[]

  const addressesThatHaveSigned = votingActivities.map((a) => a.address)
  const addressesThatHaveNotSigned = signers?.filter(
    (a: string) => !addressesThatHaveSigned.includes(a),
  )

  type VoteActivityMap = {
    approveActivities: Activity[]
    rejectActivities: Activity[]
  }
  const sortedVotingActivities = votingActivities.reduce(
    (map: VoteActivityMap, vote: Activity) => {
      if (
        vote.variant === ActivityVariant.APPROVE_REQUEST ||
        vote.variant === ActivityVariant.CREATE_AND_APPROVE_REQUEST
      ) {
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
    commentActivities,
    addressesThatHaveNotSigned: addressesThatHaveNotSigned || [],
    isExecuted: executingActivites.length > 0,
    quorum: quorum,
    terminal,
  } as RequestFrob
}

export default toFrob

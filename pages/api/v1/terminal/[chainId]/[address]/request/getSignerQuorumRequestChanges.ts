import { ActionStatus, RequestVariantType } from "@prisma/client"
import db from "db"
import { NextApiRequest, NextApiResponse } from "next"
import {
  Request,
  SignerQuorumVariant,
} from "../../../../../../../src/models/request/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Method ${method} Not Allowed`)
  }
  const { chainId, address } = body

  if (!chainId || !address) {
    res.statusCode = 422
    return res.end(
      JSON.stringify(
        `Missing parameters. Called with chainId ${chainId} and terminalAddress ${address}`,
      ),
    )
  }

  let requests
  // we want to return an object to the client that stores the
  // a map where `modifiedAddresses` has a map: keys are signer
  // addresses that map to relevant request ids, `modifiedQuorum`
  // includes the relevant request ids for quorum changes.
  let modifiedChangesToRequests = {
    modifiedAddresses: {},
    modifiedQuorum: [] as string[],
  }
  try {
    requests = await db.request.findMany({
      where: {
        terminalAddress: body?.address,
        chainId: body?.chainId,
        variant: RequestVariantType.SIGNER_QUORUM,
        actions: {
          every: {
            status: {
              // Grab all actions that aren't in a completed state
              equals: ActionStatus.NONE,
            },
          },
        },
      },
    })
  } catch (err) {
    res.statusCode = 500
    return res.end(
      JSON.stringify(`Internal error: failed to create Proposal ${err}`),
    )
  }

  if (!requests || !requests.length) {
    return res.status(200).json({ modifiedChangesToRequests })
  }

  const modifiedAddresses = {} as { [addresses: string]: string[] }
  requests.forEach((request) => {
    const signerQuorumVariantMeta = (request as Request)?.data
      ?.meta as SignerQuorumVariant
    if (signerQuorumVariantMeta) {
      const { add, remove } = signerQuorumVariantMeta
      const relevantAddresses = [...add, ...remove]
      relevantAddresses.forEach((address) => {
        if (!modifiedAddresses[address]) {
          modifiedAddresses[address] = []
        }
        if (!modifiedAddresses[address].includes(request.id)) {
          modifiedAddresses[address].push(request.id)
        }
      })
      if (
        signerQuorumVariantMeta.setQuorum &&
        body?.currentQuorum &&
        signerQuorumVariantMeta.setQuorum !== body?.currentQuorum
      ) {
        modifiedChangesToRequests?.modifiedQuorum.push(request.id)
      }
    }
  })
  Object.assign(modifiedChangesToRequests.modifiedAddresses, modifiedAddresses)

  return res.status(200).json({ modifiedChangesToRequests })
}

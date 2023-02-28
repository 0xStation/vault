import { RequestVariantType } from "@prisma/client"
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
    requests = await prisma.request.findMany({
      where: {
        variant: RequestVariantType.SIGNER_QUORUM,
      },
    })
  } catch (err) {
    res.statusCode = 500
    return res.end(
      JSON.stringify(`Internal error: failed to create Request ${err}`),
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
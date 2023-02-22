import { ActivityVariant, PrismaClient, Proof } from "@prisma/client"
import { Account } from "../src/models/account/types"
import { Action } from "../src/models/action/types"
import { Activity } from "../src/models/activity/types"
import { Request } from "../src/models/request/types"
import { Signature } from "../src/models/signature/types"

import { createAccount } from "../src/models/account/factory"
import { createAction } from "../src/models/action/factory"
import { createActivity } from "../src/models/activity/factory"
import { createRequestInput } from "../src/models/request/factory"
import { createProof, createSignature } from "../src/models/signature/factory"
import { createTerminal } from "../src/models/terminal/factory"

const prisma = new PrismaClient()

// expand in the future to allow for all custom request definition
const createRequestMock = async ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  const request = await prisma.request.create({
    data: createRequestInput({ address, chainId: chainId }),
  })

  const approvalAction = await prisma.action.create({
    data: createAction({ requestId: request.id, isRejection: false }),
  })

  const rejectionAction = await prisma.action.create({
    data: createAction({ requestId: request.id, isRejection: true }),
  })

  return [request, approvalAction, rejectionAction] as [Request, Action, Action]
}

const actionOnRequestMock = async ({
  request,
  account,
  action,
  isRejection,
}: {
  request: Request
  account: Account
  action: Action
  isRejection: boolean
}) => {
  const activity = await prisma.activity.create({
    data: createActivity({
      requestId: request.id,
      variant: isRejection
        ? ActivityVariant.REJECT_REQUEST
        : ActivityVariant.APPROVE_REQUEST,
    }),
  })

  const signature = await prisma.signature.create({
    data: createSignature({ signerAddress: account.address }),
  })

  const proof = await prisma.proof.create({
    data: createProof({ signatureId: signature.id, actionId: action.id }),
  })

  return [activity, signature, proof] as [Activity, Signature, Proof]
}

/**
 * Simple seed.
 * This seed script
 * 1. creates a terminal
 * 2. creates two accounts
 * 3. creates three random requests
 * 4. takes an "accept" action on the first request
 * 5. takes a "reject" action on the first request
 * ---
 * This gives us an initial database state of 1 terminal, 2 accounts, 3 requests in that terminal, and two actions
 * taken on that first request. The other two requests have no action, but are there to show a list of requests.
 * todo: accounts are not related to terminal
 * todo: in the future, we could have many functions for many different seed scripts to seed different use cases.
 */
async function seed() {
  const terminal = await prisma.terminal.create({
    data: createTerminal({}),
  })

  const acc1 = (await prisma.account.create({
    data: createAccount({}),
  })) as Account

  const acc2 = (await prisma.account.create({
    data: createAccount({}),
  })) as Account

  const [r1, aa1, ra1] = await createRequestMock({
    address: terminal.safeAddress,
    chainId: terminal?.chainId,
  })
  const [_r2, _aa2, _ra2] = await createRequestMock({
    address: terminal.safeAddress,
    chainId: terminal?.chainId,
  })
  const [_r3, _aa3, _ra3] = await createRequestMock({
    address: terminal.safeAddress,
    chainId: terminal?.chainId,
  })

  const [_act1, _sig1, _p1] = await actionOnRequestMock({
    request: r1,
    account: acc1,
    action: aa1,
    isRejection: false,
  })
  const [_act2, _sig2, _p2] = await actionOnRequestMock({
    request: r1,
    account: acc2,
    action: ra1,
    isRejection: true,
  })
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

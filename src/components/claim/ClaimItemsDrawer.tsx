import { ActionStatus, ActionVariant } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { REJECTION_CALL } from "lib/constants"
import { prepareSplitsWithdrawCall } from "lib/transactions/0xsplits"
import { RawCall } from "lib/transactions/call"
import { callAction } from "lib/transactions/conductor"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { usePreparedTransaction } from "../../hooks/usePreparedTransaction"
import { ClaimableItem } from "../../models/account/types"
import { useSetActionsPending } from "../../models/action/hooks"
import { Action } from "../../models/action/types"
import { RevShareWithdraw } from "../../models/automation/types"
import { useCompleteRequestsExecution } from "../../models/request/hooks"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { TokenTransfer } from "../../models/token/types"
import { addValues, transferId } from "../../models/token/utils"
import { TokenTransfersAccordion } from "../core/TokensAccordion"

const reduceTransfers = (transfers: TokenTransfer[]): TokenTransfer[] => {
  let transferAcc: Record<string, TokenTransfer> = {}
  transfers.forEach((transfer) => {
    if (!transferAcc[transferId(transfer)]) {
      transferAcc[transferId(transfer)] = JSON.parse(JSON.stringify(transfer))
    } else {
      transferAcc[transferId(transfer)].value = addValues(
        transferAcc[transferId(transfer)].value ?? "0",
        transfer.value ?? "0",
      )
    }
  })

  return Object.values(transferAcc)
}

const reduceItems = (
  requests: RequestFrob[],
  revShareWithdraws: RevShareWithdraw[],
): ClaimableItem[] => {
  return [
    ...requests.reduce(
      (acc: ClaimableItem[], request) => [
        ...acc,
        {
          note: request.data.note,
          transfers: (request.data.meta as TokenTransferVariant).transfers,
        },
      ],
      [],
    ),
    ...revShareWithdraws.reduce(
      (acc: ClaimableItem[], revShareWithdraw) => [
        ...acc,
        ...revShareWithdraw.splits.map((v) => ({
          note: v.name as string,
          transfers: [{ token: revShareWithdraw, value: v.value }],
        })),
      ],
      [],
    ),
  ]
}

const genClaimCall = (
  requests: RequestFrob[],
  revShareWithdraws: RevShareWithdraw[],
  recipient: string,
): RawCall => {
  if (requests.length > 0) {
    const action = requests[0].actions.filter(
      (action) => action.variant === ActionVariant.APPROVAL,
    )?.[0]
    return callAction({
      action,
      proofs: action.proofs,
    })
  } else if (revShareWithdraws.length > 0) {
    return prepareSplitsWithdrawCall(recipient, [revShareWithdraws[0].address])
  }
  return REJECTION_CALL
}

export const ClaimItemsDrawer = ({
  isOpen,
  setIsOpen,
  revShareWithdraws,
  requests,
  optimisticallyShow,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  revShareWithdraws: RevShareWithdraw[]
  requests: RequestFrob[]
  optimisticallyShow: (
    updatedItems: {
      requests: RequestFrob[]
      revShareWithdraws: RevShareWithdraw[]
    },
    mutation: Promise<any>,
  ) => void
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<ClaimableItem[]>(
    reduceItems(requests, revShareWithdraws),
  )
  const router = useRouter()
  const [claimCall, setClaimCall] = useState<RawCall>(
    genClaimCall(requests, revShareWithdraws, router.query.address as string),
  )

  useEffect(() => {
    setItems(reduceItems(requests, revShareWithdraws))
    setClaimCall(
      genClaimCall(requests, revShareWithdraws, router.query.address as string),
    )
  }, [requests, revShareWithdraws, router.query.address])

  const { setActionsPending } = useSetActionsPending()
  const { completeRequestsExecution } = useCompleteRequestsExecution()

  const { ready, trigger, transactionHash } = usePreparedTransaction({
    chainId: 5,
    txPayload: claimCall,
    onError: () => {
      setLoading(false)
      console.log("error")
    },
    onSendSuccess: () => {
      console.log("send success")
      setLoading(false)
      setIsOpen(false)

      // optimistic updates
      let setActionIdsPending: string[] = []
      const updatedRequests = requests.map((request: RequestFrob) => {
        let updatedActions: Action[] = []
        request.actions.forEach((action: Action) => {
          if (action.variant === ActionVariant.APPROVAL) {
            updatedActions.push({
              ...action,
              status: ActionStatus.PENDING,
              txHash: transactionHash as string,
            })
            setActionIdsPending.push(action.id)
          } else {
            updatedActions.push(action)
          }
        })
        return {
          ...request,
          actions: updatedActions,
        }
      }) as RequestFrob[]

      let updatedItems: {
        requests: RequestFrob[]
        revShareWithdraws: RevShareWithdraw[]
      } = { requests: updatedRequests, revShareWithdraws }

      optimisticallyShow(
        updatedItems,
        setActionsPending({
          actionIds: setActionIdsPending,
          txHash: transactionHash as string,
        }),
      )
    },
    onWaitSuccess: () => {
      console.log("wait success")

      // optimistic updates
    },
  })

  console.log("transactionHash", transactionHash)

  return (
    <BottomDrawer
      isOpen={isOpen}
      setIsOpen={(v: boolean) => {
        if (!v) {
          setLoading(v)
        }
        setIsOpen(v)
      }}
    >
      <h1>Claim tokens</h1>
      {items.length > 1 && (
        <div className="mt-6 border-b border-slate-200 pb-6">
          <TokenTransfersAccordion
            transfers={reduceTransfers(
              items.reduce(
                (acc: TokenTransfer[], item) => [...acc, ...item.transfers],
                [],
              ),
            )}
          />
        </div>
      )}
      <div className="mt-6 space-y-8">
        {items.map((item, index) => (
          <div
            className="space-y-3 rounded-lg bg-slate-50 p-4"
            key={`item-${index}`}
          >
            <div>
              <p className="text-xs text-slate-500">Note</p>
              <p className="mt-1">{item.note}</p>
            </div>
            <TokenTransfersAccordion
              transfers={item.transfers}
              transferBgGray={false}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 right-0 left-0 mx-auto mb-6 px-5 text-center">
        <Button
          fullWidth={true}
          loading={loading}
          onClick={() => {
            setLoading(true)
            trigger()
          }}
          disabled={!ready}
        >
          Claim
        </Button>
        {/* TODO change size of xs to match designs, needs to be smaller */}
        <p className={"mt-1 text-xs text-slate-500"}>
          You’ll be directed to confirm. This action costs gas.
        </p>
      </div>
    </BottomDrawer>
  )
}
export default ClaimItemsDrawer

import { ActionVariant } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { REJECTION_CALL } from "lib/constants"
import { RawCall } from "lib/transactions/call"
import { callAction } from "lib/transactions/conductor"
import { useEffect, useState } from "react"
import { usePreparedTransaction } from "../../hooks/usePreparedTransaction"
import { ClaimableItem } from "../../models/account/types"
import { RevShareWithdraw } from "../../models/automation/types"
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
    return REJECTION_CALL
  }
  return REJECTION_CALL
}

export const ClaimItemsDrawer = ({
  isOpen,
  setIsOpen,
  revShareWithdraws,
  requests,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  revShareWithdraws: RevShareWithdraw[]
  requests: RequestFrob[]
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<ClaimableItem[]>(
    reduceItems(requests, revShareWithdraws),
  )
  const [claimCall, setClaimCall] = useState<RawCall>(
    genClaimCall(requests, revShareWithdraws),
  )

  useEffect(() => {
    setItems(reduceItems(requests, revShareWithdraws))
    setClaimCall(genClaimCall(requests, revShareWithdraws))
  }, [requests, revShareWithdraws])

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
      // optimistic stuff
    },
    onWaitSuccess: () => {
      console.log("wait success")
      // optimistic stuff
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
      <h1 className="mb-6">Claim tokens</h1>
      <TokenTransfersAccordion
        transfers={reduceTransfers(
          items.reduce(
            (acc: TokenTransfer[], item) => [...acc, ...item.transfers],
            [],
          ),
        )}
      />
      <div className="mt-6 space-y-8 border-t border-slate-200 pt-6">
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

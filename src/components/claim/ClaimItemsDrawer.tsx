import { ActionStatus, ActionVariant } from "@prisma/client"
import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { Network } from "@ui/Network"
import { BigNumber } from "ethers"
import { REJECTION_CALL } from "lib/constants"
import { prepareSplitsDistributeCall } from "lib/encodings/0xsplits"
import { prepareSplitsWithdrawCall } from "lib/transactions/0xsplits"
import { batchCalls } from "lib/transactions/batch"
import { RawCall } from "lib/transactions/call"
import { callAction } from "lib/transactions/conductor"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useStore from "../../hooks/stores/useStore"
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
          transfers: [
            {
              token: revShareWithdraw,
              value: addValues(v.unclaimedValue, v.undistributedValue),
            },
          ],
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
  // default state when loading page, should not occur
  if (requests.length === 0 && revShareWithdraws.length === 0)
    return REJECTION_CALL

  return batchCalls([
    // call the APPROVAL action from requests
    ...requests.map((request) => {
      const action = request.actions.find(
        (action) => action.variant === ActionVariant.APPROVAL,
      )!
      return callAction({
        action,
        proofs: action.proofs,
      })
    }),
    // distribute all SplitWallets with an undistributed balance
    ...revShareWithdraws.reduce(
      (acc: RawCall[], rsw) => [
        ...acc,
        ...rsw.splits
          .filter((split) => BigNumber.from(split.undistributedValue).gt(0))
          .map((split) =>
            prepareSplitsDistributeCall(
              split.address,
              rsw.address, // tokenAddress
              split.recipients,
              split.distributorFee,
              recipient,
            ),
          ),
      ],
      [],
    ),
    // withdraw tokens from SplitMain
    // note: this MUST occur after the distributions above in order to claim the funds to the recipient
    ...(revShareWithdraws.length > 0
      ? [
          prepareSplitsWithdrawCall(
            recipient,
            revShareWithdraws.map((rsw) => rsw.address),
          ),
        ]
      : []),
  ])
}

export const ClaimItemsDrawer = ({
  isOpen,
  setIsOpen,
  revShareWithdraws,
  requests,
  optimisticallyShow,
  resetBatchState,
  executionPending = false,
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
  resetBatchState: () => void
  executionPending?: boolean
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
  const activeUser = useStore((state) => state.activeUser)

  const { ready, trigger, transactionHash } = usePreparedTransaction({
    chainId: 5,
    txPayload: claimCall,
    onError: () => {
      setLoading(false)
    },
    onSendSuccess: () => {
      setLoading(false)
      setIsOpen(false)
      resetBatchState()

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
      } = {
        requests: updatedRequests,
        revShareWithdraws: revShareWithdraws.map((rs) => ({
          ...rs,
          pendingExecution: true,
        })),
      }

      optimisticallyShow(
        updatedItems,
        setActionsPending({
          address: activeUser?.address as string,
          actionIds: setActionIdsPending,
          txHash: transactionHash as string,
        }),
      )
    },
    onWaitSuccess: () => {
      // optimistic updates
      let setActionIdsPending: string[] = []
      const updatedRequests = requests.map((request: RequestFrob) => {
        let updatedActions: Action[] = []
        request.actions.forEach((action: Action) => {
          if (action.variant === ActionVariant.APPROVAL) {
            updatedActions.push({
              ...action,
              status: ActionStatus.SUCCESS,
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
      } = {
        requests: updatedRequests,
        revShareWithdraws: revShareWithdraws.map((rs) => ({
          ...rs,
          pendingExecution: false,
        })),
      }

      optimisticallyShow(
        updatedItems,
        completeRequestsExecution({
          actionIds: setActionIdsPending,
        }),
      )
    },
  })

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
      <h1 className="pb-2">Claim tokens</h1>
      <div className="h-full overflow-y-auto pb-32">
        <div className="mt-4 space-y-2 border-b border-gray-115 pb-6">
          <div className="flex flex-row space-x-2">
            <span className="text-xs text-gray-100">Network</span>
            <Network chainId={items?.[0]?.transfers?.[0]?.token?.chainId} />
          </div>
          <TokenTransfersAccordion
            transfers={reduceTransfers(
              items.reduce(
                (acc: TokenTransfer[], item) => [...acc, ...item.transfers],
                [],
              ),
            )}
          />
        </div>
        <div className="mt-6 space-y-2">
          {items.map((item, index) => (
            <div
              className="space-y-3 rounded-lg bg-gray-200 p-4"
              key={`item-${index}`}
            >
              <div>
                <p className="text-xs text-gray">Note</p>
                <p className="mt-1">{item.note}</p>
              </div>
              <TokenTransfersAccordion
                transfers={item.transfers}
                transferBgGray={false}
              />
            </div>
          ))}
        </div>
        {/* <div className="h-32"></div> */}
      </div>
      <div className="fixed bottom-0 right-0 left-0 mx-auto border-t border-slate-200 bg-white px-5 pb-6 pt-3 text-center">
        <Button
          fullWidth={true}
          loading={loading || executionPending}
          onClick={() => {
            setLoading(true)
            trigger()
          }}
          disabled={!ready || executionPending}
        >
          Claim
        </Button>
        {/* TODO change size of xs to match designs, needs to be smaller */}
        <p className={"mt-1 text-xs text-gray"}>
          You’ll be directed to confirm. This action costs gas.
        </p>
      </div>
    </BottomDrawer>
  )
}
export default ClaimItemsDrawer

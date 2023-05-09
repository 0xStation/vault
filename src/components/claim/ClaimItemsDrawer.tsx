import { ActionStatus, ActionVariant } from "@prisma/client"
import Breakpoint from "@ui/Breakpoint"
import { Button } from "@ui/Button"
import Modal from "@ui/Modal"
import { Network } from "@ui/Network"
import { REJECTION_CALL } from "lib/constants"
import { batchCalls } from "lib/transactions/batch"
import { RawCall } from "lib/transactions/call"
import { callAction } from "lib/transactions/parallelProcessor"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useStore from "../../hooks/stores/useStore"
import { useCorrectNetwork } from "../../hooks/useCorrectNetwork"
import { usePreparedTransaction } from "../../hooks/usePreparedTransaction"
import { ClaimableItem } from "../../models/account/types"
import { useSetActionsPending } from "../../models/action/hooks"
import { Action } from "../../models/action/types"
import { RequestFrob, TokenTransferVariant } from "../../models/request/types"
import { TokenTransfer } from "../../models/token/types"
import { addValues, transferId } from "../../models/token/utils"
import { TokenTransfersAccordion } from "../core/TokensAccordion"

const BottomDrawer = dynamic(() =>
  import("@ui/BottomDrawer").then((mod) => mod.BottomDrawer),
)

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

const reduceItems = (requests: RequestFrob[]): ClaimableItem[] => {
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
  ]
}

const genClaimCall = (requests: RequestFrob[], recipient: string): RawCall => {
  // default state when loading page, should not occur
  if (requests.length === 0) return REJECTION_CALL

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
  ])
}

export const ClaimItemsDrawer = ({
  isOpen,
  setIsOpen,
  recipientAddress,
  requests,
  optimisticallyShow,
  resetBatchState,
  executionPending = false,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  recipientAddress: string
  requests: RequestFrob[]
  optimisticallyShow: (
    updatedItems: {
      requests: RequestFrob[]
    },
    mutation: Promise<any>,
  ) => void
  resetBatchState: () => void
  executionPending?: boolean
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<ClaimableItem[]>(reduceItems(requests))
  const router = useRouter()
  const [claimCall, setClaimCall] = useState<RawCall>(
    genClaimCall(requests, recipientAddress),
  )

  useEffect(() => {
    setItems(reduceItems(requests))
    setClaimCall(genClaimCall(requests, recipientAddress))
  }, [requests, router.query.address])

  const { setActionsPending } = useSetActionsPending()
  const activeUser = useStore((state) => state.activeUser)

  const chainId = items?.[0]?.transfers?.[0]?.token.chainId
  const { switchNetwork, correctNetworkSelected } = useCorrectNetwork(chainId)

  const { ready, trigger, transactionHash } = usePreparedTransaction({
    chainId,
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
      } = {
        requests: updatedRequests,
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
  })

  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) {
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
              <h2 className="pb-2">Claim tokens</h2>
              <div className="h-full overflow-y-auto pb-32">
                <div className="mt-4 space-y-2 border-b border-gray-80 pb-6">
                  <div className="flex flex-row space-x-2">
                    <span className="text-sm text-gray">Chain</span>
                    <Network
                      chainId={items?.[0]?.transfers?.[0]?.token?.chainId}
                    />
                  </div>
                  {items.length > 1 && (
                    <TokenTransfersAccordion
                      transfers={reduceTransfers(
                        items.reduce(
                          (acc: TokenTransfer[], item) => [
                            ...acc,
                            ...item.transfers,
                          ],
                          [],
                        ),
                      )}
                    />
                  )}
                </div>
                <div className="mt-6 space-y-2">
                  {items.map((item, index) => (
                    <div
                      className="space-y-3 rounded-lg bg-gray-100 p-4"
                      key={`item-${index}`}
                    >
                      <div>
                        <p className="text-gray">Note</p>
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
              <div className="fixed bottom-0 right-0 left-0 mx-auto px-5 pb-6 pt-3 text-center">
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
                <p className={"mt-1 text-sm text-gray"}>
                  This action will be recorded on-chain. You&apos;ll be directed
                  to execute.
                </p>
              </div>
            </BottomDrawer>
          )
        }
        return (
          <Modal
            isOpen={isOpen}
            setIsOpen={(v: boolean) => {
              if (!v) {
                setLoading(v)
              }
              setIsOpen(v)
            }}
          >
            <h2 className="pb-2">Claim tokens</h2>
            <div className="h-full overflow-y-auto pb-32">
              <div className="mt-4 space-y-2 border-b border-gray-90 pb-6">
                <div className="flex flex-row space-x-2">
                  <span className="text-sm text-gray">Chain</span>
                  <Network
                    chainId={items?.[0]?.transfers?.[0]?.token?.chainId}
                  />
                </div>
                {items.length > 1 && (
                  <TokenTransfersAccordion
                    transfers={reduceTransfers(
                      items.reduce(
                        (acc: TokenTransfer[], item) => [
                          ...acc,
                          ...item.transfers,
                        ],
                        [],
                      ),
                    )}
                  />
                )}
              </div>
              <div className="mt-6 space-y-2">
                {items.map((item, index) => (
                  <div
                    className="space-y-3 rounded-lg bg-gray-100 p-4"
                    key={`item-${index}`}
                  >
                    <div>
                      <p className="text-gray">Note</p>
                      <p className="mt-1">{item.note}</p>
                    </div>
                    <TokenTransfersAccordion
                      transfers={item.transfers}
                      transferBgGray={false}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="fixed bottom-0 right-0 left-0 mx-auto border-t border-gray-90 bg-black px-5 pb-6 pt-3 text-center">
              <Button
                fullWidth={true}
                loading={loading || executionPending}
                onClick={async () => {
                  setLoading(true)
                  if (!correctNetworkSelected) {
                    await switchNetwork()
                    setLoading(false)
                  } else {
                    trigger()
                  }
                }}
                disabled={
                  correctNetworkSelected && (!ready || executionPending)
                }
              >
                Claim
              </Button>
              <p className={"mt-1 text-xs text-gray"}>
                This action will be recorded on-chain. You&apos;ll be directed
                to execute.
              </p>
            </div>
          </Modal>
        )
      }}
    </Breakpoint>
  )
}
export default ClaimItemsDrawer

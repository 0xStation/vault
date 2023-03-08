import BottomDrawer from "@ui/BottomDrawer"
import { Button } from "@ui/Button"
import { useState } from "react"
import { ClaimableItem } from "../../models/account/types"
import { TokenTransfer } from "../../models/token/types"
import { addValues, transferId } from "../../models/token/utils"
import { TokenTransfersAccordion } from "../core/TokensAccordion"

const reduceTransfers = (transfers: TokenTransfer[]): TokenTransfer[] => {
  let transferAcc: Record<string, TokenTransfer> = {}
  transfers.forEach((transfer) => {
    if (!transferAcc[transferId(transfer)]) {
      transferAcc[transferId(transfer)] = transfer
    } else {
      transferAcc[transferId(transfer)].value = addValues(
        transferAcc[transferId(transfer)].value ?? "0",
        transfer.value ?? "0",
      )
    }
  })

  return Object.values(transferAcc)
}

export const ClaimItemsDrawer = ({
  isOpen,
  setIsOpen,
  items,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  items: ClaimableItem[]
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <BottomDrawer isOpen={isOpen} setIsOpen={setIsOpen}>
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
        <Button fullWidth={true} loading={loading}>
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

import { faker } from "@faker-js/faker"
import { ActionStatus, ActionVariant } from "@prisma/client"
import { Action, SwapChoice } from "./types"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

// defaults to a eth transfer to 0x65a
export const createAction = ({
  requestId,
  safeAddress,
  chainId,
  nonce,
  to,
  value,
  data,
  operation,
  recipient,
  minDate,
  isRejection = false,
}: {
  requestId?: string
  nonce?: number
  chainId?: number
  safeAddress?: string
  to?: string
  value?: string
  data?: string
  operation?: number
  recipient?: string
  minDate?: Date
  isRejection?: boolean
}) => {
  const rejectionCall = {
    to: ZERO_ADDRESS,
    value: "0",
    data: "0x",
    operation: "0",
  }

  // handy default
  // send .0001ETH to 0x65A...D63
  const sendEthCall = {
    to: "0x65A3870F48B5237f27f674Ec42eA1E017E111D63",
    value: "100000000000000",
    data: "0x",
    operation: 0,
  }

  return {
    requestId: requestId ?? "1",
    safeAddress: safeAddress ?? faker.finance.ethereumAddress(),
    chainId: chainId ?? 5,
    nonce: nonce ?? 1,
    status: ActionStatus.PENDING,
    variant: isRejection ? ActionVariant.REJECTION : ActionVariant.APPROVAL,
    data: {
      calls: [
        isRejection
          ? rejectionCall
          : {
              to: to ?? sendEthCall.to,
              value: value ?? sendEthCall.value,
              data: data ?? sendEthCall.data,
              operation: operation ?? sendEthCall.operation,
            },
      ],
      minDate: minDate ?? +new Date(),
      recipient: recipient ?? faker.finance.ethereumAddress(),
      swapChoice: SwapChoice.NONE,
    },
  } as Action
}

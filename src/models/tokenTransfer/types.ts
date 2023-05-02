import { TokenTransfer as PrismaTokenTransfer } from "@prisma/client"
import { Transfer } from "../request/types"

type TokenTransferMetadata = {
  recipient: string
  transfer: Transfer
  note?: string
  category: TokenTransferVariant
}

export enum TokenTransferVariant {
  DONATION = "DONATION",
  "NFT SALE" = "NFT SALE",
  "CONTRIBUTOR PAYMENT" = "CONTRIBUTOR PAYMENT",
  INCOME = "INCOME",
  REIMBURSEMENT = "REIMBURSEMENT",
  GRANT = "GRANT",
  SWAP = "SWAP",
  AIRDROP = "AIRDROP",
  "STAKING REWARD" = "STAKING REWARD",
  EQUITY = "EQUITY",
  OTHER = "OTHER",
}

export type TokenTransfer = PrismaTokenTransfer & {
  data: TokenTransferMetadata
}

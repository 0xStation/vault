import { Invoice as PrismaInvoice } from "@prisma/client"
import { Token } from "models/token/types"

export type Invoice = PrismaInvoice & {
  data: InvoiceMetadata
}

export type InvoiceMetadata = {
  paymentAddress: string
  splits: {
    address: string
    value: number
  }[]
  clientName: string
  clientEmail: string
  totalAmount: string
  token: Token
  note?: string
}

export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

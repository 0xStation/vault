import { z } from "zod"
import { FrequencyType, FrequencyUnit } from "../models/request/types"
import { TokenType } from "../models/token/types"

// use ZodToken.partial() for all optional fields
// https://github.com/colinhacks/zod#partial
export const ZodToken = z.object({
  chainId: z.number(),
  address: z.string(),
  type: z.enum([
    TokenType.COIN,
    TokenType.ERC20,
    TokenType.ERC721,
    TokenType.ERC1155,
  ]),
  name: z.string().optional(),
  symbol: z.string().optional(),
  decimals: z.number().optional().nullable(),
})

export const ZodTransfer = z.object({
  token: z.any(),
  value: z.string().optional(),
  tokenId: z.string().optional(), // ERC721 & ERC1155
})

export const ZodFrequencyMixin = z.object({
  frequency: z.nativeEnum(FrequencyType),
  startsAt: z.number().optional(),
  frequencyValue: z.number().optional(),
  frequencyUnit: z.nativeEnum(FrequencyUnit),
  maxOccurences: z.number().optional(),
})

export const ZodSignerQuorumVariant = z.object({
  add: z.string().array(),
  remove: z.string().array(),
  setQuorum: z.number(),
})

export const ZodTokenTransferVariant = z.object({
  transfers: ZodTransfer.array(),
  frequency: z.nativeEnum(FrequencyType),
  startsAt: z.number().optional(),
  frequencyValue: z.number().optional(),
  frequencyUnit: z.nativeEnum(FrequencyUnit).optional(),
  maxOccurences: z.number().optional(),
  recipient: z.string(),
})

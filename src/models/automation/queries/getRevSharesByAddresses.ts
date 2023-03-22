import { AutomationVariant } from "@prisma/client"
import db from "db"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { Automation } from "../types"

export const getRevSharesByAddresses = async (
  globalIds: { chainId: number; address: string }[],
) => {
  const revShares = (await db.automation.findMany({
    where: {
      OR: globalIds.map(({ chainId, address }) => ({
        variant: AutomationVariant.REV_SHARE,
        chainId,
        data: {
          path: ["meta", "address"],
          equals: toChecksumAddress(address),
        },
      })),
    },
  })) as Automation[]

  return revShares
}

import { AutomationVariant } from "@prisma/client"
import db from "db"
import { Automation } from "../types"

export const getRevSharesByAddress = async (addresses: string[]) => {
  const revShares = (await db.automation.findMany({
    where: {
      OR: addresses.map((address) => ({
        variant: AutomationVariant.REV_SHARE,
        data: {
          path: ["meta", "address"],
          equals: address,
        },
      })),
    },
  })) as Automation[]

  return revShares
}

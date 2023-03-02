import db from "db"
import toFrob from "./frob"
import { Request } from "./types"

export const getRequestById = async ({ requestId }: { requestId: string }) => {
  const request = (await db.request.findFirst({
    where: { id: requestId },
    include: {
      actions: true,
    },
  })) as Request

  const requestFrob = await toFrob(request)
  return requestFrob
}

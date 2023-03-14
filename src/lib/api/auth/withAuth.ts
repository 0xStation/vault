import { isAuthenticated } from "lib/api/auth/isAuthenticated"
import { NextApiRequest, NextApiResponse } from "next"
import { Ctx } from "./types"

export const withAuth = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: Ctx,
  ) => Promise<string | void | any>,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ctx = await isAuthenticated(req, res)

    // route handler
    await handler(req, res, ctx as Ctx)
  }
}
export default withAuth

import { isAuthenticated } from "lib/api/auth/isAuthenticated"
import { NextApiRequest, NextApiResponse } from "next"

export const withAuth = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx?: any,
  ) => Promise<string | void | any>,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ctx = await isAuthenticated(req, res)

    // route handler
    await handler(req, res, ctx)
  }
}
export default withAuth

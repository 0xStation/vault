import { isAuthenticated } from "lib/api/auth/isAuthenticated"
import { NextApiRequest, NextApiResponse } from "next"

export const withAuth = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
  ) => Promise<string | void | any>,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await isAuthenticated(req, res)

    // route handler
    await handler(req, res)
  }
}
export default withAuth

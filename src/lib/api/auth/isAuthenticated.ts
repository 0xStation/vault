import jwt, { Secret } from "jsonwebtoken"
import { NextApiRequest, NextApiResponse } from "next/types"

export const isAuthenticated = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const authToken = await req?.headers?.authorization?.replace("Bearer ", "")

  // The replace operation below ensures that any instances of '\n' in the stringified
  // public key are replaced with actual newlines, per the PEM-encoded format
  const verificationKey = process.env.DYNAMIC_PUBLIC_KEY?.replace(/\\n/g, "\n")
  try {
    const decoded = jwt.verify(authToken as string, verificationKey as Secret, {
      issuer: `app.dynamic.xyz/${process.env.DYNAMIC_ENV_ID}`,
    })
    return decoded
  } catch (err: any) {
    // If user is not authenticated, `jwt.verify` will throw.
    console.warn(`JWT failed to verify with error ${err}.`)
    return res.status(401).json({ message: `Invalid Token: ${err?.message}` })
  }
}

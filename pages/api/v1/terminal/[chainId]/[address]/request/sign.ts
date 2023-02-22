import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  switch (method) {
    case "PUT":
      if (
        !body.actionId ||
        !body.path ||
        !body.signerAddress ||
        !body.signatureMetadata
      ) {
        res.statusCode = 404
        return res.end(
          JSON.stringify(
            `Missing parameters. Called with signatureId: ${body.signatureId}, actionId: ${body.actionId}, nonce: ${body.nonce}, path: ${body.path}, signerAddress: ${body.signerAddress}`,
          ),
        )
      }

      let proof
      try {
        proof = await prisma.proof.create({
          data: {
            path: body.path,
            action: {
              connect: { id: body.actionId },
            },
            signature: {
              create: {
                signerAddress: body.signerAddress,
                data: {
                  ...body.signatureMetadata,
                },
              },
            },
          },
        })
      } catch (err) {
        res.statusCode = 500
        return res.end(
          JSON.stringify(`Internal error: failed to create Proof ${err}`),
        )
      }

      if (!proof) {
        res.statusCode = 404
        return res.end(JSON.stringify("Unable to create proof"))
      }

      return res.status(200).json(proof)
      break
    default:
      res.setHeader("Allow", ["GET", "PUT"])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}

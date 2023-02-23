import { z } from "zod"

const ProofWithSignatureArgs = z.object({
  path: z.string().array(),
  actionId: z.string(),
  signerAddress: z.string(),
  signatureMetadata: z.object({
    message: z.object({
      domain: z.any(),
      types: z.any(),
      values: z.any(),
    }),
    signature: z.string(),
  }),
  $tx: z.any().optional(),
})

export const createProofWithSignature = async (
  input: z.infer<typeof ProofWithSignatureArgs>,
) => {
  const { path, actionId, signerAddress, signatureMetadata, $tx } =
    ProofWithSignatureArgs.parse(input)

  const db = $tx || prisma

  let proof
  try {
    proof = await db.proof.create({
      data: {
        path: path,
        action: {
          connect: { id: actionId },
        },
        signature: {
          create: {
            signerAddress: signerAddress,
            data: {
              ...signatureMetadata,
            },
          },
        },
      },
    })
  } catch (err) {
    throw Error(`Error creating proof in "createProofWithSignature": ${err}`)
  }

  if (!proof) {
    throw Error(
      `Error creating proof in "createProofWithSignature". Returned with ${proof}`,
    )
  }

  return proof
}

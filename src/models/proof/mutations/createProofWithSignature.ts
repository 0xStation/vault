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
})

export const createProofWithSignature = async (
  input: z.infer<typeof ProofWithSignatureArgs>,
) => {
  const { path, actionId, signerAddress, signatureMetadata } =
    ProofWithSignatureArgs.parse(input)

  let proof
  try {
    proof = await prisma.proof.create({
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

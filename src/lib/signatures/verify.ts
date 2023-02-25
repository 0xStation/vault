import { recoverAddress } from "ethers/lib/utils.js"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { Action } from "../../models/action/types"
import { actionsTree, treeMessage } from "./tree"
import { getHash } from "./utils"

/**
 * Verify that an address did sign a merkle root
 * @param root root of the merkle tree
 * @param signature signature produced by signing our EIP712 Tree object
 * @param address claimed signer that produced the signature to verify against
 */
export const verifyTree = (
  root: string,
  signature: string,
  address: string,
) => {
  const digest = getHash(treeMessage(root))
  const signer = recoverAddress(digest, signature)
  if (toChecksumAddress(address) !== toChecksumAddress(signer)) {
    throw Error(
      `signature creator (${signer}) is different than provided address (${address})`,
    )
  }
}

/**
 * Verify that an address did sign a set of Actions
 * @param actions array of Actions used to generate a signed Tree
 * @param signature EIP712-generated signature representing approval on the entire set of `actions`
 * @param address claimed signer that produced the signature to verify against
 */
export const verifyActions = (
  actions: Action[],
  signature: string,
  address: string,
) => {
  const { root } = actionsTree(actions)
  verifyTree(root, signature, address)
}

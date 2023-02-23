import { hexlify } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"
import { BigNumber } from "ethers"
import { ActionCall } from "lib/transactions/call"
import { MerkleTree } from "merkletreejs"
import { Action } from "../../models/action/types"
import { hashAction, hashActionValues } from "./action"
import { conductorDomain, EIP712Message } from "./utils"

export type Tree = {
  root: string
  proofs: Record<string, string[]> // leaf actionHash -> bytes32[] path to reconstruct root
  message: EIP712Message // { domain, types, values } that were signed
}

/**
 * Generate a Tree given an array of Action objects
 * Intended use when approving already-created Actions from detail pages and in batch
 * @param actions array of Action objects
 * @returns a merkle tree to sign containing the root, proof branches, and EIP712-ready message
 */
export const actionsTree = (actions: Action[] = []): Tree => {
  if (actions.length === 0) {
    // if this is throwing, probably rejecting and `rejectionActionIds` is an empty array
    // fix by making sure to create the rejection action(s) for a request and add the array on the request
    // we may want to change this mechanism to something cleaner
    throw Error("attempting to sign empty actions array")
  }

  const leaves = actions
    .map((action) => hashAction(action))
    .sort((a, b) => {
      const leafA = BigNumber.from(a)
      const leafB = BigNumber.from(b)

      return leafA.gt(leafB) ? 1 : -1
    }) // sort to guarantee ordering
  const tree = new MerkleTree(leaves, keccak256)

  const root = hexlify(tree.getRoot())
  const proofs: Record<string, string[]> = {}
  leaves.forEach((leaf) => {
    proofs[leaf] = tree.getProof(leaf).map((node) => hexlify(node.data))
  })
  const message = treeMessage(root)

  return { root, proofs, message }
}

/**
 * Generate a Tree given a set of values representing a single Action
 * Intended use when making first approval while creating a new Action
 * @param values set of values for a new Action
 * @returns a merkle tree to sign containing the root, proof branches, and EIP712-ready message
 */
export const newActionTree = (
  values: ActionCall & { chainId: number },
): Tree => {
  const root = hashActionValues(values) // only one node so this leaf is the root
  const proofs = { root: [] } // only one node so path from leaf to root requires no path
  const message = treeMessage(root)
  return { root, proofs, message }
}

/**
 * Create a EIP712-ready message given the root of a merkle tree
 * @param root
 * @returns an EIP712Message ready to sign
 */
export const treeMessage = (root: string): EIP712Message => {
  return {
    domain: conductorDomain(),
    types: {
      Tree: [{ name: "root", type: "bytes32" }],
    },
    value: {
      root,
    },
  }
}

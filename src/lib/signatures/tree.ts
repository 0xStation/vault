import { hexlify } from "@ethersproject/bytes"
import { keccak256 } from "@ethersproject/keccak256"
import { BigNumber } from "ethers"
import { MerkleTree } from "merkletreejs"
import { Action } from "../../models/action/types"
import { hashAction } from "./action"
import { conductorDomain, EIP712Message } from "./utils"

export type Tree = {
  root: string
  proofs: Record<string, string[]>
  message: EIP712Message
}

export const actionsTree = (actions: Action[] = []): Tree => {
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

const treeMessage = (root: string): EIP712Message => {
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

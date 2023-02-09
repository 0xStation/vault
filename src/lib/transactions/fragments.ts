import { FunctionFragment } from "ethers/lib/utils.js"

export const multiSend = FunctionFragment.from(
  "function multiSend(bytes memory transactions)",
)

export const execute = FunctionFragment.from(
  "function execute(address safe,uint256 nonce,address executor,address to,uint256 value,uint8 operation,bytes calldata data,tuple(bytes32[] calldata path,bytes signature)[] calldata proofs, string note) external returns (bool success)",
)

import { FunctionFragment } from "ethers/lib/utils.js"

/**
 * Conventions:
 *  - link source code
 *  - name fragment: {contractName}{functionName} with camelCase
 *  - use multi-line strings for longer functions
 */

// https://github.com/0xStation/checkbook-contracts/blob/main/src/contracts/FlexSigning.sol#L93
export const conductorExecute = FunctionFragment.from(
  `function execute(
    address safe,
    uint256 nonce,
    address executor,
    address to,
    uint256 value,
    uint8 operation,
    bytes calldata data,
    tuple(
      bytes32[] calldata path,
      bytes signature
    )[] calldata proofs,
    string note
  ) external returns (bool success)`,
)

// https://github.com/safe-global/safe-contracts/blob/main/contracts/Safe.sol#L111
export const safeExecTransaction = FunctionFragment.from(
  `function execTransaction(
    address to,
    uint256 value,
    bytes calldata data,
    uint8 operation,
    uint256 safeTxGas,
    uint256 baseGas,
    uint256 gasPrice,
    address gasToken,
    address payable refundReceiver,
    bytes memory signatures
  ) public payable returns (bool success)`,
)

// https://github.com/safe-global/safe-contracts/blob/main/contracts/base/ModuleManager.sol#L34
export const safeEnableModule = FunctionFragment.from(
  "function enableModule(address module)",
)

// https://github.com/safe-global/safe-contracts/blob/main/contracts/libraries/MultiSend.sol#L26
export const multiSend = FunctionFragment.from(
  "function multiSend(bytes memory transactions)",
)

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L113
export const erc20Transfer = FunctionFragment.from(
  "function transfer(address to, uint256 amount)",
)

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol#L167
export const erc721SafeTransferFrom = FunctionFragment.from(
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
)

import { EventFragment, FunctionFragment } from "@ethersproject/abi"

const fn = (arg: string): FunctionFragment => {
  return FunctionFragment.fromString(arg)
}

const ev = (arg: string): EventFragment => {
  return EventFragment.fromString(arg)
}

/**
 * Conventions:
 *  - link source code
 *  - name fragment: {contractName}{functionName} with camelCase
 */

// https://github.com/0xStation/checkbook-contracts/blob/main/src/contracts/FlexSigning.sol#L93
export const conductorExecute = fn(
  "execute(address safe,uint256 nonce,address executor,address to,uint256 value,uint8 operation,bytes calldata data,tuple(bytes32[] calldata path,bytes signature)[] calldata proofs,string note) external returns (bool success)",
)

// https://github.com/safe-global/safe-contracts/blob/main/contracts/Safe.sol#L111
export const safeExecTransaction = fn(
  "execTransaction(address to, uint256 value, bytes calldata data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address payable refundReceiver, bytes memory signatures) public payable returns (bool success)",
)

// https://github.com/safe-global/safe-contracts/blob/main/contracts/base/ModuleManager.sol#L34
export const safeEnableModule = fn("enableModule(address module)")

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L113
export const erc20Transfer = fn("transfer(address to, uint256 amount)")

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol#L167
export const erc721SafeTransferFrom = fn(
  "safeTransferFrom(address from, address to, uint256 tokenId)",
)

// https://github.com/safe-global/safe-contracts/blob/main/contracts/libraries/MultiSend.sol#L26
export const multiSend = fn("multiSend(bytes memory transactions)")

// https://github.com/0xStation/checkbook-contracts/blob/main/src/contracts/FlexSigning.sol#L82
export const enableModuleWithinDeploy = fn(
  "enableModuleWithinDeploy() external",
)

// https://github.com/safe-global/safe-contracts/blob/9a1555a2fe33854e965ef83fddf96f1705b8d095/contracts/proxies/SafeProxyFactory.sol#L46
export const createProxyWithNonce = fn(
  "createProxyWithNonce(address _singleton,bytes initializer,uint256 saltNonce)",
)

// https://github.com/safe-global/safe-contracts/blob/761f6782b327493bc9869b0754471824e2a6635f/contracts/Safe.sol#L75
export const safeSetup = fn(
  "setup(address[] calldata _owners,uint256 _threshold,address to,bytes calldata data,address fallbackHandler,address paymentToken,uint256 payment,address payable paymentReceiver)",
)

export const proxyCreation = ev(
  "ProxyCreation(address proxy, address singleton)",
)

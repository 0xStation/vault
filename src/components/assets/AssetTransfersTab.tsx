import QrCodeEmptyState from "components/emptyStates/QrCodeEmptyState"
import {
  TransferDirection,
  TransferItem,
  useAssetTransfers,
} from "../../hooks/useAssetTransfers"
import { timeSince } from "../../lib/utils"
import networks from "../../lib/utils/networks"
import { TokenType } from "../../models/token/types"
import { Address } from "../ui/Address"
import { Avatar } from "../ui/Avatar"
import { Hyperlink } from "../ui/Hyperlink"

type TransactionProps = {
  chainId: number
  hash: string
  value: string
  date: string
  address: string
}

const TransactionItem = ({
  hash,
  value,
  date,
  address,
  chainId,
}: TransactionProps) => {
  const blockExplorer = (networks as Record<string, any>)[String(chainId)]
    .explorer
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center space-x-2">
        <div className="relative h-6 w-6 rounded-full">
          <Avatar address={address} size="sm" />
        </div>
        <div className="flex flex-col">
          <Address address={address} interactive={false} />
          <div className="flex flex-row">
            <p className="pr-1 text-sm text-gray">
              {date}
              {" · "}
            </p>
            <Hyperlink
              href={`${blockExplorer}/tx/${hash}`}
              label="View on Etherscan"
              size="xs"
            />
          </div>
        </div>
      </div>
      <p className="text-lg text-gray">{value}</p>
    </div>
  )
}

const formatAssetValue = (tx: TransferItem): string => {
  switch (tx.category) {
    case TokenType.ERC20:
      return tx.amount + " " + tx.symbol
    case TokenType.COIN:
      return tx.amount + " ETH"
    case TokenType.ERC721:
    case TokenType.ERC1155:
      return ""
  }
}

export const AssetTransfersTab = ({
  address,
  chainId,
  direction,
}: {
  address: string
  chainId: number
  direction: TransferDirection
}) => {
  const { data } = useAssetTransfers(address, chainId, direction)

  if (!data?.length) {
    const title = "Deposit tokens"
    const subtitle =
      "Transfer tokens to the Vault address or share the address to receive tokens."
    return (
      <div className="flex h-full px-4 pb-4">
        <QrCodeEmptyState
          title={title}
          subtitle={subtitle}
          address={address}
          qrCodeSize={96}
        />
      </div>
    )
  }

  return (
    <section className="space-y-4 px-4">
      {data?.map((tx: TransferItem) => (
        <TransactionItem
          key={tx.hash}
          hash={tx.hash}
          chainId={chainId}
          value={formatAssetValue(tx)}
          date={timeSince(new Date(tx.metadata.blockTimestamp)) ?? ""}
          address={direction === TransferDirection.INBOUND ? tx.from : tx.to}
        />
      ))}
    </section>
  )
}

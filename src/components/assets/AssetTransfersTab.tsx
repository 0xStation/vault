import BottomDrawer from "@ui/BottomDrawer"
import Breakpoint from "@ui/Breakpoint"
import { Button } from "@ui/Button"
import RightSlider from "@ui/RightSlider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/Select"
import QrCodeEmptyState from "components/emptyStates/QrCodeEmptyState"
import { toChecksumAddress } from "lib/utils/toChecksumAddress"
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller, FieldValues, useForm } from "react-hook-form"
import { useIsSigner } from "../../../src/hooks/useIsSigner"
import { useUpsertTokenTransfer } from "../../hooks/tokenTransfer/useUpsertTokenTransfer"
import {
  TransferDirection,
  TransferItem,
  useAssetTransfers,
} from "../../hooks/useAssetTransfers"
import { timeSince } from "../../lib/utils"
import networks from "../../lib/utils/networks"
import { TokenType } from "../../models/token/types"
import { TokenTransferVariant } from "../../models/tokenTransfer/types"
import TextareaWithLabel from "../form/TextareaWithLabel"
import { ArrowDownRight, ArrowUpRight } from "../icons"
import { Address } from "../ui/Address"
import { Avatar } from "../ui/Avatar"
import { Hyperlink } from "../ui/Hyperlink"

type TransactionProps = {
  chainId: number
  hash: string
  value: string
  date: string
  from: string
  to: string
  address: string
  terminalAddress: string
  note?: string
  category?: string
}

const TransactionItem = ({
  hash,
  value,
  date,
  from,
  to,
  address,
  chainId,
  terminalAddress,
  note,
  category,
}: TransactionProps) => {
  const isSigner = useIsSigner({ address: terminalAddress, chainId })
  const [sliderOpen, setSliderOpen] = useState(false)
  const blockExplorer = (networks as Record<string, any>)[String(chainId)]
    .explorer

  const { upsertTokenTransfer } = useUpsertTokenTransfer(
    chainId,
    terminalAddress,
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    mode: "all",
    defaultValues: {
      description: note,
      category: category,
    } as FieldValues,
  })

  const onSubmit = async (data: any) => {
    await upsertTokenTransfer({
      txHash: hash,
      note: data.description,
      category: data.category,
    })
    setSliderOpen(false)
  }

  const onError = (errors: any) => {
    console.log(errors)
  }

  const TxContent = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <section className="border-b border-gray-90 py-6 px-2">
          <div className="text-xl font-bold">{value}</div>
          <div className="mt-2 flex flex-row space-x-2">
            <div className="text-sm text-gray-80">{date}</div>
            <Hyperlink
              href={`${blockExplorer}/tx/${hash}`}
              label="View on Etherscan"
              size="xs"
            />
          </div>
        </section>
        <section className="py-6 px-2">
          <div className="flex flex-row">
            <div className="w-1/2">
              <div className=" text-sm text-gray-80">From</div>
              <Address address={from} interactive={false} />
            </div>
            <div className="w-1/2">
              <div className="text-sm text-gray-80">To</div>
              <Address address={to} interactive={false} />
            </div>
          </div>
          <div className="mt-6">
            <TextareaWithLabel
              label={"Description"}
              register={register}
              name="description"
              errors={errors}
              placeholder="Add a note"
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 text-base font-bold">Category</div>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, ref } }) => (
                <Select onValueChange={onChange} defaultValue={category}>
                  <SelectTrigger ref={ref} className="bg-black">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(TokenTransferVariant).map((key, i) => (
                      <SelectItem key={key} ref={ref} value={key}>
                        {key.slice(0, 3) === "NFT"
                          ? key.slice(0, 3) + key.slice(3).toLocaleLowerCase()
                          : key.charAt(0) + key.slice(1).toLocaleLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </section>
        <div className="fixed bottom-0 right-0 left-0 mx-auto mb-3 w-full px-4 text-center">
          <Button
            disabled={!isSigner || isSubmitting}
            type="submit"
            loading={isSubmitting}
            fullWidth={true}
          >
            Save changes
          </Button>
        </div>
      </form>
    )
  }

  return (
    <>
      <Breakpoint>
        {(isMobile) => {
          if (isMobile) {
            return (
              <BottomDrawer isOpen={sliderOpen} setIsOpen={setSliderOpen}>
                <TxContent />
              </BottomDrawer>
            )
          } else {
            return (
              <RightSlider open={sliderOpen} setOpen={setSliderOpen}>
                <TxContent />
              </RightSlider>
            )
          }
        }}
      </Breakpoint>

      <Breakpoint>
        {(isMobile) => {
          if (isMobile) {
            return (
              <div
                className="flex cursor-pointer flex-row items-center justify-between border-b border-gray-90 pb-4"
                onClick={() => {
                  setSliderOpen(true)
                }}
              >
                <div className="flex flex-row items-center space-x-2">
                  <div className="relative h-6 w-6 rounded-full">
                    <Avatar address={address} size="sm" />
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {(note ?? "Sent | Received").substring(0, 40)}
                      {note && note.length > 40 && "..."}
                    </span>
                    <div className="col-span-2 text-gray-50">{date}</div>
                  </div>
                </div>

                <div className="col-span-2 flex flex-row items-center space-x-2 text-gray-50">
                  {toChecksumAddress(from) ===
                  toChecksumAddress(terminalAddress) ? (
                    <ArrowUpRight size={"sm"} />
                  ) : (
                    <ArrowDownRight size={"sm"} />
                  )}
                  <span>{value}</span>
                </div>
              </div>
            )
          } else {
            return (
              <div
                className="grid cursor-pointer grid-cols-12"
                onClick={() => {
                  setSliderOpen(true)
                }}
              >
                <div className="col-span-6">
                  <div className="flex flex-row space-x-2">
                    <div className="relative h-6 w-6 rounded-full">
                      <Avatar address={address} size="sm" />
                    </div>
                    <span>
                      {(
                        note ??
                        (toChecksumAddress(from) ===
                        toChecksumAddress(terminalAddress)
                          ? "Sent"
                          : "Received")
                      ).substring(0, 40)}
                      {note && note.length > 40 && "..."}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 flex flex-row items-center space-x-2">
                  {toChecksumAddress(from) ===
                  toChecksumAddress(terminalAddress) ? (
                    <ArrowUpRight size={"sm"} />
                  ) : (
                    <ArrowDownRight size={"sm"} />
                  )}
                  <span>{value}</span>
                </div>
                <div className="col-span-2 text-gray-50">{date}</div>
                <div className="col-span-2">{category ?? "Uncategorized"}</div>
              </div>
            )
          }
        }}
      </Breakpoint>
    </>
  )
}

const formatAssetValue = (tx: TransferItem): string => {
  const minVal = 0.00001
  switch (tx.category) {
    case TokenType.ERC20:
      if (tx.amount && tx.amount < minVal) {
        return `< ${minVal} ` + tx.symbol
      }
      return tx.amount + " " + tx.symbol
    case TokenType.COIN:
      if (tx.amount && tx.amount < minVal) {
        return `< ${minVal} ETH`
      }
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
  const router = useRouter()
  const { address: safeAddress } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { data } = useAssetTransfers(address, chainId, direction)

  if (!data?.length) {
    const title = "Deposit tokens"
    const subtitle =
      "Transfer tokens to the Project address or share the address to receive tokens."
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
      <div className="hidden grid-cols-12 sm:grid">
        <div className="col-span-6 text-xs text-gray-80">Description</div>
        <div className="col-span-2 text-xs text-gray-80">Amount</div>
        <div className="col-span-2 text-xs text-gray-80">Date</div>
        <div className="col-span-2 text-xs text-gray-80">Category</div>
      </div>
      <div className="space-y-4">
        {data?.map((tx: TransferItem) => (
          <TransactionItem
            key={tx.hash}
            hash={tx.hash}
            chainId={chainId}
            value={formatAssetValue(tx)}
            date={timeSince(new Date(tx.metadata.blockTimestamp)) ?? ""}
            from={tx.from}
            to={tx.to}
            category={tx?.data?.category}
            note={tx?.data?.note}
            terminalAddress={safeAddress as string}
            address={direction === TransferDirection.INBOUND ? tx.from : tx.to}
          />
        ))}
      </div>
    </section>
  )
}

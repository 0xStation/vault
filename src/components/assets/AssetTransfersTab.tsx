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
import { convertGlobalId } from "models/terminal/utils"
import { useRouter } from "next/router"
import { useState } from "react"
import { Controller, FieldValues, useForm } from "react-hook-form"
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
    watch,
  } = useForm({
    mode: "all", // validate on all event handlers (onBlur, onChange, onSubmit)
    defaultValues: {
      description: note,
      category,
    } as FieldValues,
  })

  const onSubmit = async (data: any) => {
    await upsertTokenTransfer({
      txHash: hash,
      note: data.description,
      category: data.category,
    })
  }

  const onError = (errors: any) => {
    console.log(errors)
  }

  return (
    <>
      <RightSlider open={sliderOpen} setOpen={setSliderOpen}>
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
                  <Select onValueChange={onChange}>
                    <SelectTrigger ref={ref}>
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(TokenTransferVariant).map((key, i) => (
                        <SelectItem key={key} ref={ref} value={key}>
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).toLocaleLowerCase()}
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
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              fullWidth={true}
            >
              Save changes
            </Button>
          </div>
        </form>
      </RightSlider>
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
            <span>{note ?? "Sent | Received"}</span>
          </div>
        </div>
        <div className="col-span-2">{value}</div>
        <div className="col-span-2 text-gray-50">{date}</div>
        <div className="col-span-2">
          {category ?? "Uncategorized"}
          {/* <select className="w-full border-b border-gray-90 bg-black pb-1">
            <option>Select one</option>
            {Object.keys(TokenTransferVariant).map((key) => (
              <option value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1).toLocaleLowerCase()}
              </option>
            ))}
          </select> */}
        </div>
      </div>
    </>
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
  const router = useRouter()
  const { address: safeAddress } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  const { data } = useAssetTransfers(address, chainId, direction)
  console.log(data)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    mode: "all", // validate on all event handlers (onBlur, onChange, onSubmit)
    defaultValues: {} as FieldValues,
  })

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

  const onSubmit = (data: any) => {
    console.log(data)
  }

  const onError = (errors: any) => {
    console.log(errors)
  }

  return (
    <section className="space-y-4 px-4">
      <div className="grid grid-cols-12">
        <div className="col-span-6 text-xs text-gray-80">Description</div>
        <div className="col-span-2 text-xs text-gray-80">Amount</div>
        <div className="col-span-2 text-xs text-gray-80">Date</div>
        <div className="col-span-2 text-xs text-gray-80">Category</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
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
      </form>
    </section>
  )
}

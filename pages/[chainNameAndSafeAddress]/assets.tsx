import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEnsAvatar, useEnsName } from "wagmi"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import {
  TerminalAssetsHistoryFilter,
  TerminalAssetsHistoryFilterBar,
} from "../../src/components/core/TabBars/TerminalAssetsHistoryFilterBar"
import {
  TerminalAssetsTab,
  TerminalAssetsTabBar,
} from "../../src/components/core/TabBars/TerminalAssetsTabBar"
import { ArrowLeft } from "../../src/components/icons"
import { Hyperlink } from "../../src/components/ui/Hyperlink"
import LabelCard from "../../src/components/ui/LabelCard"
import { useAssetTransfers } from "../../src/hooks/useAssetTransfers"
import useFungibleTokenData from "../../src/hooks/useFungibleTokenData"
import useNFTAssetData from "../../src/hooks/useNFTAssetData"
import networks from "../../src/lib/utils/networks"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const CurrentAssetsTab = ({ terminal }: { terminal: Terminal }) => {
  const { data: nftData } = useNFTAssetData(
    terminal.safeAddress,
    terminal.chainId,
  )
  const { data: tokenData } = useFungibleTokenData(
    terminal.safeAddress,
    terminal.chainId,
  )
  if (!tokenData || !nftData) {
    return <></>
  }

  const totalAssetValue = tokenData?.reduce((sum: number, token: any) => {
    if (token.fiat) sum += token.fiat?.[0].tokenValue
    return sum
  }, 0)

  return (
    <TabsContent value={TerminalAssetsTab.CURRENT}>
      <section className="mt-4 px-4">
        <LabelCard
          label="Total assets value"
          description={`$${totalAssetValue
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} // regex for adding commas
        />
      </section>

      <section className="mt-4 space-y-4 px-4">
        {tokenData.map((response: any, idx: number) => {
          return (
            <div
              className="flex flex-row items-center justify-between"
              key={`token-${idx}`}
            >
              <div className="flex flex-row items-center space-x-2">
                <div className="relative h-6 w-6 rounded-full">
                  {response?.symbolLogos ? (
                    <Image
                      src={response?.symbolLogos?.[0].URI}
                      alt={"Logo for token"}
                      fill={true}
                      className="block rounded-full object-contain"
                    />
                  ) : (
                    <span className="block h-6 w-6 rounded-full bg-slate-200"></span>
                  )}
                </div>
                <div className="flex flex-col">
                  <p>{response.name}</p>
                  <p className="text-xs text-slate-500">{response.pretty}</p>
                </div>
              </div>
              <p className="text-lg">
                ${response.fiat ? response.fiat?.[0].pretty : "0.00"}
              </p>
            </div>
          )
        })}
      </section>
      <section className="mt-4 grid grid-cols-2 gap-3 px-4">
        {nftData.map((response: any, idx: number) => {
          return (
            <div key={`nft-${idx}`}>
              <div className="relative h-[175px] w-[175px]">
                <Image
                  src={response.nft.previews[1].URI}
                  alt={response.nft.description}
                  fill={true}
                  className="rounded border border-slate-200 object-contain"
                />
              </div>
              <h3 className="mt-2">{response.nft.title}</h3>
              <h4 className="text-sm text-slate-500">0.15 ETH · $305.38</h4>
            </div>
          )
        })}
      </section>
    </TabsContent>
  )
}

type TransactionProps = {
  chainId: number
  hash: string
  value: string
  date: string
  from: string
}

const TransactionItem = ({
  hash,
  value,
  date,
  from,
  chainId,
}: TransactionProps) => {
  const { data: name } = useEnsName({ address: from as `0x${string}` })
  const { data: avatarUri } = useEnsAvatar({ address: from as `0x${string}` })

  const blockExplorer = (networks as Record<string, any>)[String(chainId)]
    .explorer
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center space-x-2">
        <div className="relative h-6 w-6 rounded-full">
          {avatarUri ? (
            <Image
              src={avatarUri}
              alt={"Logo for transaction"}
              fill={true}
              className="block rounded-full object-contain"
            />
          ) : (
            <span className="block h-6 w-6 rounded-full bg-slate-200"></span>
          )}
        </div>
        <div className="flex flex-col">
          <p>{name ?? from.slice(0, 6) + "..." + from.slice(-3)}</p>
          <div className="flex flex-row">
            <p className="text-xs text-slate-500">
              {date}
              {" . "}
            </p>
            <Hyperlink
              href={`${blockExplorer}/tx/${hash}`}
              label="View on Etherscan"
            />
          </div>
        </div>
      </div>
      <p className="text-lg text-slate-500">{value}</p>
    </div>
  )
}

type TransferItem = {
  hash: string
  from: string
  to: string
  value: number | null
  asset: string | null
  category: "external" | "erc20" | "erc721" | "erc1155"
  metadata: {
    blockTimestamp: string
  }
}

const formatAssetValue = (tx: TransferItem): string => {
  switch (tx.category) {
    case "erc20":
      return tx.value + " " + tx.asset
    case "external":
      return tx.value + " ETH"
    case "erc721":
    case "erc1155":
      return ""
  }
}

const formatTxDate = (tx: TransferItem): string => {
  const date = new Date(tx.metadata.blockTimestamp)
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  return months[date.getMonth()] + " " + date.getDate()
}

const IncomingAssetsTab = ({ terminal }: { terminal: Terminal }) => {
  const { data } = useAssetTransfers(terminal.safeAddress, terminal.chainId)

  return (
    <section className="space-y-4 px-4">
      {data?.map((tx: TransferItem) => (
        <TransactionItem
          key={tx.hash}
          hash={tx.hash}
          chainId={terminal.chainId}
          value={formatAssetValue(tx)}
          date={formatTxDate(tx)}
          from={tx.from}
        />
      ))}
    </section>
  )
}

const TerminalAssetsHistoryTab = ({ terminal }: { terminal: Terminal }) => {
  return (
    <TabsContent value={TerminalAssetsTab.HISTORY}>
      <TerminalAssetsHistoryFilterBar>
        <TabsContent value={TerminalAssetsHistoryFilter.SENT}>
          <section className="space-y-4 px-4"></section>
        </TabsContent>
        <TabsContent value={TerminalAssetsHistoryFilter.RECEIVED}>
          <IncomingAssetsTab terminal={terminal} />
        </TabsContent>
      </TerminalAssetsHistoryFilterBar>
    </TabsContent>
  )
}

const TerminalAssetsPage = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()

  return (
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block w-fit px-4"
      >
        <ArrowLeft />
      </Link>
      <section className="mt-4 px-4">
        <h3 className="mb-2 text-lg font-bold">Assets</h3>
      </section>
      <TerminalAssetsTabBar>
        <CurrentAssetsTab terminal={terminal} />
        <TerminalAssetsHistoryTab terminal={terminal} />
      </TerminalAssetsTabBar>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chainNameAndSafeAddress = context?.params?.chainNameAndSafeAddress

  try {
    let terminal = await getTerminalFromChainNameAndSafeAddress(
      chainNameAndSafeAddress,
    )
    terminal = JSON.parse(JSON.stringify(terminal))
    return {
      props: {
        terminal: terminal,
      },
    }
  } catch (e) {
    console.error(`Error: ${e}`)
    return {
      notFound: true,
    }
  }
}

export default TerminalAssetsPage

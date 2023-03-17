import QrCodeEmptyState from "components/emptyStates/QrCodeEmptyState"
import Image from "next/image"
import useFungibleTokenData from "../../hooks/useFungibleTokenData"
import useNFTAssetData from "../../hooks/useNFTAssetData"
import { Terminal } from "../../models/terminal/types"
import { TerminalAssetsTab } from "../core/TabBars/TerminalAssetsTabBar"
import LabelCard from "../ui/LabelCard"
import { TabsContent } from "../ui/Tabs"

export const CurrentAssetsTab = ({ terminal }: { terminal: Terminal }) => {
  const { data: nftData } = useNFTAssetData(
    terminal?.safeAddress,
    terminal?.chainId,
  )
  const { data: tokenData } = useFungibleTokenData(
    terminal?.chainId,
    terminal?.safeAddress,
  )

  const totalAssetValue = tokenData?.reduce((sum: number, token: any) => {
    if (token.fiat) sum += token.fiat?.[0].tokenValue
    return sum
  }, 0)

  return (
    <TabsContent value={TerminalAssetsTab.CURRENT}>
      {!tokenData?.length && !nftData?.length ? (
        <div className="flex h-[calc(100%+18px)] px-4 pb-4 pt-4">
          <QrCodeEmptyState
            title="No tokens"
            subtitle="Transfer tokens to the Project address or share the address to receive tokens."
            address={terminal?.safeAddress}
            qrCodeSize={96}
          />
        </div>
      ) : (
        <>
          <section className="mt-6 px-4">
            <LabelCard
              label="Total balance"
              description={`$${(totalAssetValue ?? 0)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} // regex for adding commas
            />
          </section>

          <section className="mt-6 space-y-4 px-4">
            {tokenData?.map((response: any, idx: number) => {
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
                        <span className="block h-6 w-6 rounded-full bg-gray-80"></span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p>{response.name}</p>
                      <p className="text-sm text-gray">{response.pretty}</p>
                    </div>
                  </div>
                  <p className="text-lg">
                    ${response.fiat ? response.fiat?.[0].pretty : "0.00"}
                  </p>
                </div>
              )
            })}
          </section>
          <section className="mt-6 grid grid-cols-2 gap-3 px-4">
            {nftData?.map((response: any, idx: number) => {
              return (
                <div key={`nft-${idx}`}>
                  <div className="relative h-[175px] w-[175px]">
                    <Image
                      src={response.nft.previews[1].URI}
                      alt={response.nft.description}
                      fill={true}
                      className="rounded border border-gray-80 object-contain"
                    />
                  </div>
                  <h3 className="mt-2">{response.nft.title}</h3>
                  <h4 className="text-base text-gray">0.15 ETH · $305.38</h4>
                </div>
              )
            })}
          </section>
        </>
      )}
    </TabsContent>
  )
}

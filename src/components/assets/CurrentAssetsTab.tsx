import Image from "next/image"
import useFungibleTokenData from "../../hooks/useFungibleTokenData"
import useNFTAssetData from "../../hooks/useNFTAssetData"
import { Terminal } from "../../models/terminal/types"
import { TerminalAssetsTab } from "../core/TabBars/TerminalAssetsTabBar"
import LabelCard from "../ui/LabelCard"
import { TabsContent } from "../ui/Tabs"

export const CurrentAssetsTab = ({ terminal }: { terminal: Terminal }) => {
  const { data: nftData } = useNFTAssetData(
    terminal.safeAddress,
    terminal.chainId,
  )
  const { data: tokenData } = useFungibleTokenData(
    terminal.chainId,
    terminal.safeAddress,
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
          label="Total balance value"
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
      <section className="mt-4 grid grid-cols-2 gap-3 px-4">
        {nftData.map((response: any, idx: number) => {
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
    </TabsContent>
  )
}

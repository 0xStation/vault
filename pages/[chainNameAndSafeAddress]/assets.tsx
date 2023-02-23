import { GetServerSidePropsContext } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import { ArrowLeft } from "../../src/components/icons"
import LabelCard from "../../src/components/ui/LabelCard"
import useFungibleTokenData from "../../src/hooks/useFungibleTokenData"
import useNFTAssetData from "../../src/hooks/useNFTAssetData"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const TerminalAssetsPage = ({ terminal }: { terminal: Terminal }) => {
  const router = useRouter()

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
    <>
      <AccountNavBar />
      <Link
        href={`/${router.query.chainNameAndSafeAddress}`}
        className="block px-4"
      >
        <ArrowLeft />
      </Link>
      <div>
        <section className="mt-4 px-4">
          <h3 className="mb-2 text-lg font-bold">Assets</h3>
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
                <div className="relative h-[200px] w-full">
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
      </div>
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

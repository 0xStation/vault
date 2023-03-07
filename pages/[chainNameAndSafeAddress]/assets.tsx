import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { AssetTransfersTab } from "../../src/components/assets/AssetTransfersTab"
import { CurrentAssetsTab } from "../../src/components/assets/CurrentAssetsTab"
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
import { TransferDirection } from "../../src/hooks/useAssetTransfers"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"

const TerminalAssetsHistoryTab = ({ terminal }: { terminal: Terminal }) => {
  return (
    <TabsContent value={TerminalAssetsTab.HISTORY}>
      <TerminalAssetsHistoryFilterBar>
        <TabsContent value={TerminalAssetsHistoryFilter.SENT}>
          <AssetTransfersTab
            terminal={terminal}
            direction={TransferDirection.OUTBOUND}
          />
        </TabsContent>
        <TabsContent value={TerminalAssetsHistoryFilter.RECEIVED}>
          <AssetTransfersTab
            terminal={terminal}
            direction={TransferDirection.INBOUND}
          />
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

import { TabsContent } from "@ui/Tabs"
import { useRouter } from "next/router"
import { usePermissionsStore } from "../../hooks/stores/usePermissionsStore"
import RequestListByFilterAndTab from "../core/RequestListByFilterAndTab"
import TerminalRequestStatusFilterBar, {
  TerminalRequestStatusFilter,
} from "../core/TabBars/TerminalRequestStatusFilterBar"
import { TerminalRequestTypeTab } from "../core/TabBars/TerminalRequestTypeTabBar"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const RequestContentForFilterAndTab = ({
  filter,
  tab,
}: {
  filter: string
  tab: string
}) => {
  const router = useRouter()
  if (
    !router.query.chainNameAndSafeAddress ||
    typeof router.query.chainNameAndSafeAddress !== "string"
  ) {
    return <></>
  }
  const [chainName, safeAddress] =
    router.query.chainNameAndSafeAddress.split(":")

  const chainId = chainNameToChainId[chainName]

  if (!chainId) {
    return <></>
  }

  return (
    <TabsContent value={filter}>
      <RequestListByFilterAndTab
        filter={filter}
        tab={tab}
        safeChainId={chainId}
        safeAddress={safeAddress}
      />
    </TabsContent>
  )
}

const RequestTabContent = ({ tab }: { tab: TerminalRequestTypeTab }) => {
  const isSigner = usePermissionsStore((state) => state.isSigner)
  return (
    <TabsContent value={tab}>
      <TerminalRequestStatusFilterBar>
        {isSigner ? (
          <>
            <RequestContentForFilterAndTab
              filter={TerminalRequestStatusFilter.NEEDS_ACTION}
              tab={tab}
            />
            <RequestContentForFilterAndTab
              filter={TerminalRequestStatusFilter.AWAITING_OTHERS}
              tab={tab}
            />
          </>
        ) : (
          <RequestContentForFilterAndTab
            filter={TerminalRequestStatusFilter.OPEN}
            tab={tab}
          />
        )}
        <RequestContentForFilterAndTab
          filter={TerminalRequestStatusFilter.CLOSED}
          tab={tab}
        />
      </TerminalRequestStatusFilterBar>
    </TabsContent>
  )
}

export default RequestTabContent

import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button } from "@ui/Button"
import { TabsContent } from "@ui/Tabs"
import LoadingTerminalList from "components/core/LoadingTerminalList"
import { EmptyState } from "components/emptyStates/EmptyState"
import { addQueryParam } from "lib/utils/updateQueryParam"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useStore from "../../hooks/stores/useStore"
import { useTerminalsBySigner } from "../../models/terminal/hooks"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"
import TerminalListItem from "./TerminalListItem"

export const ProfileTerminalsList = ({ address }: { address: string }) => {
  const { isLoading, terminals } = useTerminalsBySigner(address)
  const { primaryWallet } = useDynamicContext()
  const router = useRouter()
  const { isMobile } = useBreakpoint()

  const setShowTabBottomBorder = useStore(
    (state) => state.setShowTabBottomBorder,
  )

  useEffect(() => {
    if (!!terminals && terminals.length > 0) {
      setShowTabBottomBorder(true)
    } else {
      setShowTabBottomBorder(false)
    }
  }, [terminals])

  return (
    <TabsContent value={ProfileTab.TERMINALS}>
      {isLoading ? (
        <LoadingTerminalList />
      ) : terminals?.length === 0 ? (
        <div className="flex h-[calc(100%+18px)] px-4 pt-4">
          <EmptyState
            title={
              primaryWallet?.address === router.query.address
                ? "Create your first Vault"
                : "No Vaults"
            }
            subtitle={
              primaryWallet?.address === router.query.address
                ? "Start raising funds, managing spend, and splitting revenue with your collective."
                : "This profile hasn't created or is not part of any Vaults."
            }
          >
            {primaryWallet?.address === router.query.address ? (
              <span className="mx-auto">
                <Button
                  onClick={() => {
                    if (isMobile) {
                      router.push("/project/new")
                    } else {
                      addQueryParam(router, "createTerminalSliderOpen", "true")
                    }
                  }}
                >
                  Create a Vault
                </Button>
              </span>
            ) : null}
          </EmptyState>
        </div>
      ) : (
        <ul className="px-0 sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-4">
          {terminals?.map((terminal) => (
            <TerminalListItem terminal={terminal} key={terminal.id} />
          ))}
        </ul>
      )}
    </TabsContent>
  )
}

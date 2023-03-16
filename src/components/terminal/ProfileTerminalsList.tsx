import { TabsContent } from "@ui/Tabs"
import { EmptyState } from "components/emptyStates/EmptyState"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useStore from "../../hooks/stores/useStore"
import { useTerminalsBySigner } from "../../models/terminal/hooks"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"
import TerminalListItem from "./TerminalListItem"

export const ProfileTerminalsList = ({ address }: { address: string }) => {
  const { isLoading, terminals } = useTerminalsBySigner(address)
  const router = useRouter()

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
        <></>
      ) : terminals?.length === 0 ? (
        <div className="flex h-[calc(100%+18px)] px-4 pt-4">
          <EmptyState
            title="Create your first Project"
            subtitle="Start raising funds, building cool shit, managing spend, and splitting revenue with your squad."
          />
        </div>
      ) : (
        <ul className="sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-4">
          {terminals?.map((terminal) => (
            <TerminalListItem terminal={terminal} key={terminal.id} />
          ))}
        </ul>
      )}
    </TabsContent>
  )
}

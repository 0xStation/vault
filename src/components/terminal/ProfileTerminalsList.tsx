import { TabsContent } from "@ui/Tabs"
import { useTerminalsBySigner } from "../../models/terminal/hooks"
import { EmptyList } from "../core/EmptyList"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"
import TerminalListItem from "./TerminalListItem"

export const ProfileTerminalsList = ({ address }: { address: string }) => {
  const { isLoading, terminals } = useTerminalsBySigner(address)

  return (
    <TabsContent value={ProfileTab.TERMINALS}>
      {isLoading ? (
        <></>
      ) : terminals?.length === 0 ? (
        <EmptyList
          title="No Terminals"
          subtitle="Something delightful & not cringey."
        />
      ) : (
        <ul>
          {terminals?.map((terminal) => (
            <TerminalListItem terminal={terminal} key={terminal.id} />
          ))}
        </ul>
      )}
    </TabsContent>
  )
}

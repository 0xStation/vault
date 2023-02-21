import { TabsContent } from "@ui/Tabs"
import { useTerminalsBySigner } from "../../models/terminal/queries/getTerminalsBySignerAddress"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"
import TerminalListItem from "./TerminalListItem"

export const ProfileTerminalsList = ({ address }: { address: string }) => {
  const { terminals } = useTerminalsBySigner(address)

  return (
    <TabsContent value={ProfileTab.TERMINALS}>
      <ul>
        {terminals?.map((terminal) => (
          <TerminalListItem terminal={terminal} key={terminal.id} />
        ))}
      </ul>
    </TabsContent>
  )
}

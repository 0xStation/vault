import { Button } from "@ui/Button"
import { TabsContent } from "@ui/Tabs"
import { useRouter } from "next/router"
import { useTerminalsBySigner } from "../../models/terminal/hooks"
import { EmptyList } from "../core/EmptyList"
import { ProfileTab } from "../core/TabBars/ProfileTabBar"
import TerminalListItem from "./TerminalListItem"

export const ProfileTerminalsList = ({ address }: { address: string }) => {
  const { isLoading, terminals } = useTerminalsBySigner(address)
  const router = useRouter()

  return (
    <TabsContent value={ProfileTab.TERMINALS}>
      {isLoading ? (
        <></>
      ) : terminals?.length === 0 ? (
        <EmptyList
          title="No Terminals"
          subtitle="Something delightful & not cringey."
        >
          <div className="mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                router.push("/terminal/new")
              }}
            >
              + New Terminal
            </Button>
          </div>
        </EmptyList>
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

import { PillTabsContent } from "@ui/PillTabs"
import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import prisma from "../../../prisma/client"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import ProfileNavBar, {
  ProfileTab,
} from "../../../src/components/core/ProfileNavBar"
import ProfileRequestsNavBar, {
  ProfileRequestPill,
} from "../../../src/components/core/ProfileRequestsNavBar"
import RequestListForm from "../../../src/components/request/RequestListForm"
import TerminalListItem from "../../../src/components/terminal/TerminalListItem"
import { Account } from "../../../src/models/account/types"
import { getRequests } from "../../../src/models/request/requests"
import { RequestFrob } from "../../../src/models/request/types"
import { Terminal } from "../../../src/models/terminal/types"

const ProfilePage = ({
  account,
  terminals,
  requests,
}: {
  account: Account
  terminals: Terminal[]
  requests: RequestFrob[]
}) => {
  const router = useRouter()
  const tab = router.query.tab as ProfileTab
  const pill = router.query.pill as ProfileRequestPill

  return (
    <>
      <AccountNavBar />
      <AvatarAddress address={account.address} size="lg" className="px-4" />
      <ProfileNavBar className="mt-4" value={tab}>
        <TabsContent value={ProfileTab.TERMINALS}>
          <ul className="mt-6">
            {terminals.map((terminal) => (
              <TerminalListItem terminal={terminal} key={terminal.id} />
            ))}
          </ul>
        </TabsContent>
        <TabsContent value={ProfileTab.REQUESTS}>
          <ProfileRequestsNavBar className="mt-3" defaultValue={pill}>
            <PillTabsContent value={ProfileRequestPill.CLAIM}>
              <RequestListForm requests={requests} />
            </PillTabsContent>
            <PillTabsContent value={ProfileRequestPill.CREATED}>
              <RequestListForm requests={requests.slice(0, 2)} />
            </PillTabsContent>
            <PillTabsContent value={ProfileRequestPill.CLAIMED}>
              <RequestListForm requests={[]} />
            </PillTabsContent>
          </ProfileRequestsNavBar>
        </TabsContent>
      </ProfileNavBar>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // url params
  const address = context?.params?.address

  if (typeof address !== "string") {
    // Throw a 404 error if the `myParam` query parameter is missing or is string[]
    return {
      notFound: true,
    }
  }

  const account = await prisma.account.findUnique({
    where: {
      chainId_address: {
        chainId: 0,
        address,
      },
    },
  })

  if (!account) {
    // Throw a 404 error if terminal is not found
    return {
      notFound: true,
    }
  }

  const terminals = await prisma.terminal.findMany()
  const requests = await getRequests({})

  return {
    props: {
      account: JSON.parse(JSON.stringify(account)),
      terminals: JSON.parse(JSON.stringify(terminals)),
      requests: JSON.parse(JSON.stringify(requests)),
    },
  }
}

export default ProfilePage

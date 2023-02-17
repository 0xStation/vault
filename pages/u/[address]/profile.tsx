import { PillTabsContent } from "@ui/PillTabs"
import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import prisma from "../../../prisma/client"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import ProfileNavBar from "../../../src/components/core/ProfileNavBar"
import ProfileRequestsNavBar from "../../../src/components/core/ProfileRequestsNavBar"
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
  return (
    <>
      <AccountNavBar />
      <AvatarAddress address={account.address} size="lg" className="px-4" />
      <ProfileNavBar className="mt-4">
        <TabsContent value="terminals">
          <ul className="mt-6">
            {terminals.map((terminal) => (
              <TerminalListItem terminal={terminal} key={terminal.id} />
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="requests">
          <ProfileRequestsNavBar className="mt-3">
            <PillTabsContent value="claim">
              <RequestListForm requests={requests} />
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

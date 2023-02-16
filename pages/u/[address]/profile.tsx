import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import prisma from "../../../prisma/client"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import ProfileNavBar from "../../../src/components/core/ProfileNavBar"
import { User } from "../../../src/components/core/User"
import { Account } from "../../../src/models/account/types"

const ProfilePage = ({ account }: { account: Account }) => {
  return (
    <>
      <AccountNavBar />
      <div className="space-y-4 px-4">
        <User address={account.address} size="lg" />
        <ProfileNavBar>
          <TabsContent value="terminals">
            <div>Terminals</div>
          </TabsContent>
          <TabsContent value="requests">
            <div>Requests</div>
          </TabsContent>
        </ProfileNavBar>
      </div>
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

  console.log("account", account)

  if (!account) {
    // Throw a 404 error if terminal is not found
    return {
      notFound: true,
    }
  }

  //   let requests = await getRequestsByTerminal({ terminalId: terminal.id })
  // requests = JSON.parse(JSON.stringify(requests))
  return {
    props: {
      account: JSON.parse(JSON.stringify(account)),
    },
  }
}

export default ProfilePage

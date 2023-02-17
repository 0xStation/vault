import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import { useState } from "react"
import { useForm } from "react-hook-form"
import prisma from "../../../prisma/client"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import ProfileNavBar from "../../../src/components/core/ProfileNavBar"
import ProfileRequestsNavBar from "../../../src/components/core/ProfileRequestsNavBar"
import RequestCard from "../../../src/components/core/RequestCard"
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
  const [selectedRequests, setSelectedRequests] = useState<any[]>([])
  const { register, handleSubmit, watch, reset } = useForm()

  watch((data) => {
    const checkBoxEntries = Object.entries(data)
    const checkedBoxes = checkBoxEntries.filter(([_key, v]) => v)
    setSelectedRequests(checkedBoxes)
  })

  const requestIsSelected = (id: string) => {
    return selectedRequests.find(([rId, _v]: [string, boolean]) => rId === id)
  }

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
            <ul className="mt-4">
              {requests.map((request) => (
                <RequestCard
                  showTerminal={request.terminal}
                  disabled={
                    selectedRequests.length > 0 &&
                    !requestIsSelected(request.id)
                  }
                  key={`request-${request.id}`}
                  request={request}
                  formRegister={register}
                />
              ))}
            </ul>
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

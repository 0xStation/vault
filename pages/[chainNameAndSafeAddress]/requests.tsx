import { TabsContent } from "@ui/Tabs"
import { GetServerSidePropsContext } from "next"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAccount } from "wagmi"
import prisma from "../../prisma/client"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import RequestsNavBar from "../../src/components/core/RequestsNavbar"
import RequestListForm from "../../src/components/request/RequestListForm"
import { getRequestsByTerminal } from "../../src/models/request/requests"
import { RequestFrob } from "../../src/models/request/types"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const TerminalRequestsPage = ({ requests }: { requests: RequestFrob[] }) => {
  const { address } = useAccount()
  const [selectedRequests, setSelectedRequests] = useState<any[]>([])
  const { register, handleSubmit, watch, reset } = useForm()

  // I'd like to nest these as their own routes but I don't think it will work until
  // next beta releases...
  const needsAttentionRequests = requests.filter(
    (r) =>
      !(
        r.approveActivities.some((a) => a.address === address) ||
        r.rejectActivities.some((a) => a.address === address)
      ),
  )
  const awaitingOthersRequests = requests.filter(
    (r) =>
      // need to check if ready to execute because then this should go in "needs attention"
      r.approveActivities.some((a) => a.address === address) ||
      r.rejectActivities.some((a) => a.address === address),
  )
  const closedRequests = requests.filter((r) => r.isExecuted)
  const allRequests = requests

  const requestContentForTab = (tab: string, requests: RequestFrob[]) => {
    return (
      <TabsContent value={tab}>
        <RequestListForm requests={requests} />
      </TabsContent>
    )
  }

  return (
    <>
      <AccountNavBar />
      <RequestsNavBar>
        {requestContentForTab("needs_attention", needsAttentionRequests)}
        {requestContentForTab("awaiting_others", awaitingOthersRequests)}
        {requestContentForTab("closed", closedRequests)}
        {requestContentForTab("all", allRequests)}
      </RequestsNavBar>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // url params
  const chainNameAndSafeAddress = context?.params?.chainNameAndSafeAddress

  if (typeof chainNameAndSafeAddress !== "string") {
    // Throw a 404 error if the `myParam` query parameter is missing or is string[]
    return {
      notFound: true,
    }
  }

  const [chainName, safeAddress] = chainNameAndSafeAddress.split(":")
  if (!chainName || !safeAddress) {
    // Throw a 404 error if chainName or safeAddress are not found
    // (invalid format... should be gor:0x...)
    return {
      notFound: true,
    }
  }

  const chainId = chainNameToChainId[chainName]
  if (!chainId) {
    // Throw a 404 error if chainName is not recognized
    return {
      notFound: true,
    }
  }

  const terminal = await prisma.terminal.findFirst({
    where: {
      chainId,
      safeAddress,
    },
  })

  if (!terminal) {
    // Throw a 404 error if terminal is not found
    return {
      notFound: true,
    }
  }

  let requests = await getRequestsByTerminal({ terminalId: terminal.id })
  requests = JSON.parse(JSON.stringify(requests))
  return {
    props: {
      requests: requests,
    },
  }
}

export default TerminalRequestsPage

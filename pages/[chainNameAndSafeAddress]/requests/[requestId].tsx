import { Avatar } from "@ui/Avatar"
import { GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import prisma from "../../../prisma/client"
import { AccountNavBar } from "../../../src/components/core/AccountNavBar"
import ActivityItem from "../../../src/components/core/ActivityItem"
import { AvatarAddress } from "../../../src/components/core/AvatarAddress"
import { ArrowLeft, Copy } from "../../../src/components/icons"
import { timeSince } from "../../../src/lib/utils"
import { getRequestById } from "../../../src/models/request/requests"
import { RequestFrob } from "../../../src/models/request/types"

const chainNameToChainId: Record<string, number | undefined> = {
  eth: 1,
  gor: 5,
}

const TerminalRequestIdPage = ({ request }: { request: RequestFrob }) => {
  const router = useRouter()
  return (
    <>
      <div className="fixed w-full bg-white">
        <AccountNavBar />
        <div className="flex w-full items-center justify-between space-x-3 border-b border-b-slate-200 py-2 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h4 className="text-xs text-slate-500">#{request.number}</h4>
          <Copy />
        </div>
      </div>
      <div className="divide-y divide-slate-200 pt-[143px]">
        <section className="space-y-3 p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-3">
              <span className="block h-4 min-h-[1rem] w-4 min-w-[1rem] rounded-full bg-violet"></span>
              <Avatar size="sm" address={request.data.createdBy} />
              <h3 className="max-w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap">
                {request.data.createdBy}
              </h3>
            </div>
            <span className="ml-3 shrink-0 self-start text-xs text-slate-500">
              {timeSince(request.createdAt)}
            </span>
          </div>
          <h3 className="max-w-[30ch] overflow-hidden text-ellipsis whitespace-nowrap">
            {request.data.note}
          </h3>
          {/* TODO -- it's possible the request isn't a recipient/token type  */}
          <div className="flex flex-row justify-between">
            <span className="text-slate-500">Recipient(s)</span>
            <span>xxx</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-slate-500">Token(s)</span>
            <span>xxx</span>
          </div>
        </section>
        <section className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3>Votes</h3>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-sm">
              <span className="font-bold">Quorum:</span> 2
            </span>
          </div>
          <h4 className="mt-2 text-xs font-bold">
            Approved ({request.approveActivities.length})
          </h4>
          {request.approveActivities.map((activity, idx) => {
            return (
              <AvatarAddress
                key={`approval-Account-${idx}`}
                className="mt-1"
                size="sm"
                address={activity.address}
              />
            )
          })}

          <h4 className="mt-2 text-xs font-bold">
            Rejected ({request.rejectActivities.length})
          </h4>
          {request.rejectActivities.map((activity, idx) => {
            return (
              <AvatarAddress
                key={`rejection-Account-${idx}`}
                className="mt-1"
                size="sm"
                address={activity.address}
              />
            )
          })}
          <h4 className="mt-2 text-xs font-bold">Has not voted (x)</h4>
          {/* TODO */}
        </section>
        <section className="p-4">
          <h3 className="mb-4">Timeline</h3>
          <ActivityItem accountAddress={"0x"} />
        </section>
      </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // url params
  const chainNameAndSafeAddress = context?.params?.chainNameAndSafeAddress
  const requestId = context?.params?.requestId

  if (
    typeof chainNameAndSafeAddress !== "string" ||
    typeof requestId !== "string"
  ) {
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

  // requestId should be enough on it's own
  // but if it doesn't share the proper terminalId
  // then the URL shouldn't be considered valid
  // hence, we might add terminalId
  let request = await getRequestById({ requestId })

  if (!request) {
    return {
      notFound: true,
    }
  }

  request = JSON.parse(JSON.stringify(request))
  return {
    props: {
      request,
    },
  }
}

export default TerminalRequestIdPage

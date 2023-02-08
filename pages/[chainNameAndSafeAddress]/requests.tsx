import { Avatar } from "@ui/Avatar"
import prisma from "../../prisma/client"
import { ArrowUpRight, ChatBubble } from "../../src/components/icons/"
import { Request, TokenTransferVariant } from "../../src/models/request/types"

const TerminalRequestsPage = ({ requests }: { requests: Request[] }) => {
  return (
    <div className="divide-y">
      {requests.map((request, idx) => {
        let transfer = (request.data.meta as TokenTransferVariant).transfers[0]
        let transferCount = (request.data.meta as TokenTransferVariant)
          .transfers.length
        return (
          <div key={`request-${idx}`} className="w-full p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center space-x-3">
                  <input type="checkbox" />
                  <span className="h-4 w-4 rounded-full bg-violet"></span>
                  <Avatar
                    size="sm"
                    pfpUrl={
                      "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7"
                    }
                  />
                  <h3>{request.data.note}</h3>
                </div>
                <span className="text-sm text-slate-500">Jan 24</span>
              </div>
              <div className="flex flex-row items-center space-x-2 text-slate-500">
                <span className="text-sm text-slate-500"># {idx + 1}</span>
                <ArrowUpRight size={"SM"} />
                <span className="text-sm text-slate-500">
                  {transfer.amount} {transfer.token.symbol}{" "}
                  {transferCount > 1 && `and ${transferCount - 1} others`}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between text-sm text-slate-500">
                <span>Created by {"name.eth"}</span>
                <div className="flex flex-row items-center space-x-1">
                  <ChatBubble size={"SM"} />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export async function getServerSideProps() {
  let requests = await prisma.request.findMany()
  requests = JSON.parse(JSON.stringify(requests))
  return {
    props: {
      requests: requests,
    },
  }
}

export default TerminalRequestsPage

import prisma from "../../prisma/client"
import RequestCard from "../../src/components/core/RequestCard"
import { Request } from "../../src/models/request/types"

const TerminalRequestsPage = ({ requests }: { requests: Request[] }) => {
  return (
    <div className="divide-y divide-slate-200">
      {requests.map((request, idx) => {
        return (
          <RequestCard key={`request-${idx}`} index={idx} request={request} />
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

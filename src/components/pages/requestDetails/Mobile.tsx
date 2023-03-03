import { useRouter } from "next/router"
import { AccountNavBar } from "../../../components/core/AccountNavBar"
import { ArrowLeft, Copy } from "../../../components/icons"
import { useRequest } from "../../../models/request/hooks"
import RequestDetailsContent from "./components/RequestDetailsContent"

const RequestDetailsMobile = () => {
  const router = useRouter()

  const { request, mutate } = useRequest(router.query.requestId as string)

  if (!request) {
    return <></>
  }
  return (
    <>
      <div className="w-full max-w-[580px]">
        <AccountNavBar />
        <div className="flex w-full items-center justify-between space-x-3 border-b border-b-slate-200 py-2 px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft />
          </button>
          <h4 className="text-xs text-slate-500">#{request?.number}</h4>
          <Copy />
        </div>
      </div>
      <RequestDetailsContent request={request} mutate={mutate} />
    </>
  )
}

export default RequestDetailsMobile

import { useRouter } from "next/router"
import { AccountNavBar } from "../../../components/core/AccountNavBar"
import { ArrowLeft } from "../../../components/icons"
import { useRequest } from "../../../models/request/hooks"
import RequestDetailsContent from "./components/RequestDetailsContent"

const RequestDetailsMobile = () => {
  const router = useRouter()

  const { request, mutate } = useRequest(router.query.requestId as string)

  if (!request) {
    return <></>
  }

  const mutateRequest = ({
    fn,
    requestId,
    payload,
  }: {
    fn: Promise<any>
    requestId: string
    payload: any
  }) => {
    mutate(fn, {
      optimisticData: payload,
      populateCache: false,
      revalidate: false,
    })
  }

  return (
    <>
      <div className="w-full max-w-[580px]">
        <AccountNavBar />
        <div className="flex w-full items-center justify-between space-x-3 border-b border-b-gray-80 py-2 px-4">
          <button
            onClick={() =>
              router.push(`/${router.query.chainNameAndSafeAddress}/proposals`)
            }
          >
            <ArrowLeft />
          </button>
          <h4 className="text-sm text-gray">#{request?.number}</h4>
          {/* empty span to keep number centered */}
          <span></span>
        </div>
      </div>
      <RequestDetailsContent request={request} mutateRequest={mutateRequest} />
    </>
  )
}

export default RequestDetailsMobile

import { useRouter } from "next/router"
import { useRequest } from "../../../models/request/hooks"
import RequestDetailsContent from "./components/RequestDetailsContent"

const RequestDetailsDesktop = () => {
  const router = useRouter()

  const { request, mutate } = useRequest(router.query.requestId as string)

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

  if (!request) {
    return <></>
  }
  return (
    <RequestDetailsContent request={request} mutateRequest={mutateRequest} />
  )
}

export default RequestDetailsDesktop

import { useRouter } from "next/router"
import { useRequest } from "../../../models/request/hooks"
import RequestDetailsContent from "./components/RequestDetailsContent"

const RequestDetailsDesktop = () => {
  const router = useRouter()

  const { request, mutate } = useRequest(router.query.requestId as string)

  if (!request) {
    return <></>
  }
  return <RequestDetailsContent request={request} mutate={mutate} />
}

export default RequestDetailsDesktop

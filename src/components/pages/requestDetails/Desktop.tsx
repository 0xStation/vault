import { useRouter } from "next/router"
import { useRequest } from "../../../models/request/hooks"
import RequestDetailsContent from "./components/RequestDetailsContent"

const RequestDetailsDesktop = () => {
  const router = useRouter()

  const { mutate } = useRequest(router.query.requestId as string)

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
    <div className="mx-auto w-full max-w-[580px]">
      <RequestDetailsContent mutateRequest={mutateRequest} />
    </div>
  )
}

export default RequestDetailsDesktop

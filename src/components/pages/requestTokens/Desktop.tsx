import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import RequestTokensContent from "./components/RequestTokensContent"

const RequestTokensDesktop = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  return (
    <Layout
      backFunc={() => router.push(`/${chainNameAndSafeAddress}/proposals`)}
      isCloseIcon={true}
    >
      <RequestTokensContent />
    </Layout>
  )
}

export default RequestTokensDesktop

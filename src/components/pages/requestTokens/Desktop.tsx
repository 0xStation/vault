import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import SendTokensContent from "./components/RequestTokensContent"

const RequestTokensDesktop = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  return (
    <Layout
      backFunc={() => router.push(`/${chainNameAndSafeAddress}/proposals`)}
      isCloseIcon={true}
    >
      <SendTokensContent />
    </Layout>
  )
}

export default RequestTokensDesktop

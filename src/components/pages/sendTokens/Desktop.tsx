import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import SendTokensContent from "./components/SendTokensContent"

const SendTokensDesktop = () => {
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

export default SendTokensDesktop

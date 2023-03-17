import Layout from "components/terminalCreation/Layout"
import { useRouter } from "next/router"
import SendTokensContent from "./components/SendTokensContent"

const SendTokensMobile = () => {
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

export default SendTokensMobile

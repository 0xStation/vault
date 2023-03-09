import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import SendTokensContent from "./components/SendTokensContent"

const SendTokensMobile = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  return (
    <Layout
      backFunc={() => router.push(`/${chainNameAndSafeAddress}/requests`)}
      isCloseIcon={true}
    >
      <SendTokensContent />
    </Layout>
  )
}

export default SendTokensMobile

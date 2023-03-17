import { useRouter } from "next/router"
import SendTokensContent from "./components/SendTokensContent"

const SendTokensMobile = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  return (
    // Note: This creates duplication of 'x' on mobile but not sure if removing it will impact anything else or not
    // <Layout
    //   backFunc={() => router.push(`/${chainNameAndSafeAddress}/proposals`)}
    //   isCloseIcon={true}
    // >
    <SendTokensContent />
    // </Layout>
  )
}

export default SendTokensMobile

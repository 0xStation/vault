import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import NewAutomationContent from "./components/NewAutomationContent"

const NewAutomationDesktop = () => {
  const router = useRouter()
  return (
    <Layout backFunc={() => router.back()} isCloseIcon={false}>
      <NewAutomationContent />
    </Layout>
  )
}

export default NewAutomationDesktop

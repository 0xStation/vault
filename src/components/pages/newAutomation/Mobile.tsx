import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import NewAutomationContent from "./components/NewAutomationContent"

const NewAutomationMobile = () => {
  const router = useRouter()

  return (
    <div className="px-4">
      <Layout backFunc={() => router.back()} isCloseIcon={false}>
        <NewAutomationContent />
      </Layout>
    </div>
  )
}

export default NewAutomationMobile

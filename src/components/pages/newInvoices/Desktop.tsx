import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import NewInvoicesContent from "./components/NewInvoicesContent"

const NewInvoicesDesktop = () => {
  const router = useRouter()
  return (
    <Layout backFunc={() => router.back()} isCloseIcon={false}>
      <NewInvoicesContent />
    </Layout>
  )
}

export default NewInvoicesDesktop

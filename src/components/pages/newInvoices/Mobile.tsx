import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import NewInvoicesContent from "./components/NewInvoicesContent"

const NewInvoicesMobile = () => {
  const router = useRouter()

  return (
    <div className="px-4">
      <Layout backFunc={() => router.back()} isCloseIcon={false}>
        <NewInvoicesContent />
      </Layout>
    </div>
  )
}

export default NewInvoicesMobile

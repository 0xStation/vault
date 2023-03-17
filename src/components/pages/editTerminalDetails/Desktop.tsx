import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import EditTerminalContent from "./components/EditTerminalContent"

const EditTerminalDesktop = () => {
  const router = useRouter()
  return (
    <Layout backFunc={() => router.back()} isCloseIcon={false}>
      <EditTerminalContent />
    </Layout>
  )
}

export default EditTerminalDesktop

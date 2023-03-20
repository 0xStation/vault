import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import EditTerminalContent from "./components/EditTerminalContent"

const EditTerminalMobile = () => {
  const router = useRouter()

  return (
    <div className="px-4">
      <Layout
        backFunc={() =>
          router.push(`/${router.query.chainNameAndSafeAddress}/details`)
        }
        isCloseIcon={false}
      >
        <EditTerminalContent />
      </Layout>
    </div>
  )
}

export default EditTerminalMobile

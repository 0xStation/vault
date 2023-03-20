import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import EditMembersContent from "./components/EditMembersContent"

const EditMembersMobile = () => {
  const router = useRouter()
  return (
    <div className="px-4">
      <Layout backFunc={() => router.back()} isCloseIcon={true}>
        <EditMembersContent />
      </Layout>
    </div>
  )
}

export default EditMembersMobile

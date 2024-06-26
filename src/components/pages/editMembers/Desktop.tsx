import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import EditMembersContent from "./components/EditMembersContent"

const EditMembersDesktop = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  return (
    <Layout
      backFunc={() => router.push(`/${chainNameAndSafeAddress}/members`)}
      isCloseIcon={true}
    >
      <EditMembersContent />
    </Layout>
  )
}

export default EditMembersDesktop

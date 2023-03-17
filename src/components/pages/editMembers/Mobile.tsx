import { useRouter } from "next/router"
import Layout from "../../terminalCreation/Layout"
import EditMembersContent from "./components/EditMembersContent"

const EditMembersMobile = () => {
  const router = useRouter()
  const { chainNameAndSafeAddress } = router.query
  return (
    <div className="px-4">
      <Layout
        backFunc={() => router.push(`/${chainNameAndSafeAddress}/members`)}
        isCloseIcon={true}
      >
        <EditMembersContent />
      </Layout>
    </div>
  )
}

export default EditMembersMobile

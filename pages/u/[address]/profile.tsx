import Breakpoint from "@ui/Breakpoint"
import Head from "next/head"
import { useRouter } from "next/router"
import Desktop from "../../../src/components/pages/profile/Desktop"
import Mobile from "../../../src/components/pages/profile/Mobile"

const ProfilePage = ({}: {}) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Profile | {router?.query?.address}</title>
      </Head>
      <Breakpoint>
        {(isMobile) => {
          if (isMobile) {
            return <Mobile />
          }
          return <Desktop />
        }}
      </Breakpoint>
    </>
  )
}

export default ProfilePage

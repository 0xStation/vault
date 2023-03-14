import Link from "next/link"
import { useRouter } from "next/router"
import { ReadyToClaim } from "./ReadyToClaim"

export const ProfileReadyToClaim = () => {
  const router = useRouter()
  const address = router.query.address as string

  return (
    <Link href={`/u/${address}/profile/claim`}>
      <ReadyToClaim address={address} />
    </Link>
  )
}

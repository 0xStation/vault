import Link from "next/link"
import { useRouter } from "next/router"
import { convertGlobalId } from "../../models/terminal/utils"
import { ReadyToClaim } from "./ReadyToClaim"

export const TerminalReadyToClaim = () => {
  const router = useRouter()
  const { address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  return (
    <Link href={`/${router.query.chainNameAndSafeAddress}/claim`}>
      <ReadyToClaim address={address!} />
    </Link>
  )
}

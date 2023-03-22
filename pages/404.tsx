import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { Button } from "@ui/Button"
import AccountNavBar from "components/core/AccountNavBar"
import { EmptyState } from "components/emptyStates/EmptyState"
import { LINKS } from "lib/constants"
import Link from "next/link"
import { useRouter } from "next/router"

export const Custom404 = () => {
  const { primaryWallet } = useDynamicContext()
  const router = useRouter()
  return (
    <div className="h-screen">
      <AccountNavBar />
      {/* calc is to remove the nav */}
      <div className="flex h-[calc(100%-100px)] p-4">
        <EmptyState
          title="404"
          subtitle="Page not found. Check the URL and try again or contact Station Help Desk."
        >
          <div className="mx-auto flex flex-col">
            {primaryWallet?.address && (
              <Button
                onClick={() =>
                  router.push(`/${primaryWallet?.address}/profile`)
                }
              >
                Go back to Profile
              </Button>
            )}
            <Link href={LINKS.HELP_DESK} className="mt-3 font-bold text-violet">
              Contact Help Desk
            </Link>
          </div>
        </EmptyState>
      </div>
    </div>
  )
}

export default Custom404

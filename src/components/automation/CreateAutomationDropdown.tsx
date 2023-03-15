import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"
import Link from "next/link"
import { useRouter } from "next/router"
import useStore from "../../hooks/stores/useStore"
import { parseGlobalId } from "../../models/terminal/utils"

export const CreateAutomationDropdown = () => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  const activeUser = useStore((state) => state.activeUser)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        {/* Copy same styles as primary, base button because annoying console.error if we use Button component */}
        <div className="relative cursor-pointer rounded border bg-violet px-3 py-1 text-base font-medium font-medium text-black hover:bg-violet/80">
          + Create
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuItem>
          <Link
            href={`/${router.query.chainNameAndSafeAddress}/automations/new`}
            className="w-full"
          >
            Revenue share
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

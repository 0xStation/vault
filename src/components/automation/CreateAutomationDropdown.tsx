import { Button } from "@ui/Button"
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
        <Button size="sm">+ Create</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuItem className="focus:bg-white">
          <Link
            href={`/${router.query.chainNameAndSafeAddress}/automations/new`}
          >
            Revenue share
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

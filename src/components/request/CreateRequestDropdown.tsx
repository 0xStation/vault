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
import { useCreateFakeSendTokensRequest } from "../../models/request/hooks"
import { parseGlobalId } from "../../models/terminal/utils"

export const CreateRequestDropdown = () => {
  const router = useRouter()
  const { chainId, address } = parseGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )

  const activeUser = useStore((state) => state.activeUser)

  const { createFakeSendTokens } = useCreateFakeSendTokensRequest(
    chainId,
    address,
  )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <Button size="sm">+ Create</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuItem className="focus:bg-white">
          <button
            onClick={() => {
              // TODO: temp solution, change when we have send tokens form
              console.log("send tokens")
              createFakeSendTokens({
                chainId,
                address,
                createdBy: activeUser?.address,
              })
            }}
          >
            Send tokens
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-white">
          Request tokens
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-white">
          <Link href={`/${router.query.chainNameAndSafeAddress}/members/edit`}>
            Edit members
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

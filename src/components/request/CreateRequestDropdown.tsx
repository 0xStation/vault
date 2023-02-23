import { Button } from "@ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown"

export const CreateRequestDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="">
        <Button size="sm">+ Create</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuItem className="focus:bg-white">
          <button
            onClick={() => {
              console.log("send tokens")
            }}
          >
            Send tokens
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-white">
          Request tokens
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-white">
          Edit members
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

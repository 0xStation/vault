import { Button } from "@ui/Button"
import truncateString from "lib/utils"
import { useState } from "react"

export const CopyAddressButton = ({ address }: { address: string }) => {
  const [addressCopied, setAddressCopied] = useState<boolean>(false)
  return (
    <>
      <div className="mx-auto w-fit rounded-full bg-gray py-2 px-11">
        {truncateString(address, 4)}
      </div>
      <span className="mx-auto mt-6 flex justify-center">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(address as string)
            setAddressCopied(true)
            setTimeout(() => setAddressCopied(false), 1500)
          }}
        >
          {addressCopied ? "Copied!" : "Copy address"}
        </Button>
      </span>
    </>
  )
}

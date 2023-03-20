import { isAddress } from "@ethersproject/address"
import { CopyAddressButton } from "components/core/CopyAddressButton"
import { removeQueryParam } from "lib/utils/updateQueryParam"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const useRevSharePrompt = () => {
  const router = useRouter()

  const showPrompt = router.query.showPrompt
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false)

  useEffect(() => {
    if (isAddress(showPrompt as `0x${string}`)) {
      setIsPromptOpen(true)
    } else {
      setIsPromptOpen(false)
    }
  }, [showPrompt])

  const closePromptDrawer = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "showPrompt")
    }
  }

  return {
    isOpen: isPromptOpen,
    setIsOpen: closePromptDrawer,
    children: (
      <div>
        <h2>Just one more step, connect with your fundraising tools</h2>
        <div className="mt-3">
          Copy the Automation address and paste it as the payout recipient.
        </div>

        <div className="mt-9 space-y-6">
          <video loop autoPlay muted className="mb-6 border border-gray-80">
            <source src="/videos/nft-rev-share-tutorial.mp4" type="video/mp4" />
          </video>
          <CopyAddressButton address={showPrompt as string} />
        </div>
      </div>
    ),
  }
}

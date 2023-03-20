import { CogIcon, PlusIcon } from "@heroicons/react/24/solid"
import BottomDrawer from "@ui/BottomDrawer"
import Breakpoint from "@ui/Breakpoint"
import Modal from "@ui/Modal"
import RightSlider from "@ui/RightSlider"
import { CopyAddressButton } from "components/core/CopyAddressButton"
import QRCode from "components/core/QrCode"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import { convertGlobalId } from "models/terminal/utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ArrowUpRight } from "../icons"
import NewAutomationContent from "../pages/newAutomation/components/NewAutomationContent"
import RequestTokensContent from "../pages/requestTokens/components/RequestTokensContent"

const TerminalActionBar = () => {
  const router = useRouter()
  const { address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const [requestTokenSliderOpen, setRequestTokenSliderOpen] =
    useState<boolean>(false)

  const closeRequestTokenSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "requestTokenSliderOpen")
    }
  }

  const [newAutomationSliderOpen, setNewAutomationSliderOpen] =
    useState<boolean>(false)

  const closeNewAutomationSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "automationSliderOpen")
    }
  }

  const [qrCodeOpen, setQrCodeOpen] = useState<boolean>(false)

  useEffect(() => {
    if (router.query.requestTokenSliderOpen) {
      setRequestTokenSliderOpen(true)
      setNewAutomationSliderOpen(false)
    } else if (router.query.automationSliderOpen) {
      setNewAutomationSliderOpen(true)
      setRequestTokenSliderOpen(false)
    } else {
      setRequestTokenSliderOpen(false)
      setNewAutomationSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider
        open={requestTokenSliderOpen}
        setOpen={closeRequestTokenSlider}
      >
        <RequestTokensContent />
      </RightSlider>
      <RightSlider
        open={newAutomationSliderOpen}
        setOpen={closeNewAutomationSlider}
      >
        <NewAutomationContent />
      </RightSlider>

      <Breakpoint>
        {(isMobile) => {
          if (isMobile) {
            return (
              <BottomDrawer isOpen={qrCodeOpen} setIsOpen={setQrCodeOpen}>
                <div className="space-y-4">
                  <h2>Add tokens</h2>
                  <p>
                    Share tokens to the Project address or share the address to
                    receive tokens.
                  </p>
                  <QRCode value={address} size={42}></QRCode>
                  <CopyAddressButton address={address as string} />
                </div>
              </BottomDrawer>
            )
          }
          return (
            <Modal isOpen={qrCodeOpen} setIsOpen={setQrCodeOpen}>
              <div className="space-y-4">
                <h2>Add tokens</h2>
                <p>
                  Share tokens to the Project address or share the address to
                  receive tokens.
                </p>
                <QRCode value={address} size={42}></QRCode>
                <CopyAddressButton address={address as string} />
              </div>
            </Modal>
          )
        }}
      </Breakpoint>

      <div className="mx-auto flex flex-row justify-center space-x-6">
        <div
          className="flex cursor-pointer flex-col items-center space-y-2"
          onClick={() => {
            setQrCodeOpen(true)
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white transition-colors hover:bg-gray-90">
            <PlusIcon className="h-6 w-6" />
          </div>
          <span className="text-sm">Add Tokens</span>
        </div>

        <Breakpoint>
          {(isMobile) => {
            if (isMobile) {
              return (
                <Link
                  href={`/${router.query.chainNameAndSafeAddress}/proposals/tokens/new`}
                  className="block"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white">
                      <ArrowUpRight />
                    </div>
                    <span className="text-sm">Send</span>
                  </div>
                </Link>
              )
            }
            return (
              <div
                className="flex cursor-pointer flex-col items-center space-y-2"
                onClick={() => {
                  addQueryParam(router, "requestTokenSliderOpen", "true")
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white transition-colors hover:bg-gray-90">
                  <ArrowUpRight />
                </div>
                <span className="text-sm">Send</span>
              </div>
            )
          }}
        </Breakpoint>

        <Breakpoint>
          {(isMobile) => {
            if (isMobile) {
              return (
                <Link
                  href={`/${router.query.chainNameAndSafeAddress}/automations/new`}
                  className="block"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white">
                      <CogIcon className="h-6 w-6" />
                    </div>
                    <span className="text-sm">Automate</span>
                  </div>
                </Link>
              )
            }
            return (
              <div
                className="flex cursor-pointer flex-col items-center space-y-2"
                onClick={() => {
                  addQueryParam(router, "automationSliderOpen", "true")
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white transition-colors hover:bg-gray-90">
                  <CogIcon className="h-6 w-6" />
                </div>
                <span className="text-sm">Automate</span>
              </div>
            )
          }}
        </Breakpoint>
      </div>
    </>
  )
}

export default TerminalActionBar

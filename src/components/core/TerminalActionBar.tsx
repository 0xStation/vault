import { CogIcon, PlusIcon } from "@heroicons/react/24/solid"
import Breakpoint from "@ui/Breakpoint"
import QRCode from "components/core/QrCode"
import { addQueryParam, removeQueryParam } from "lib/utils/updateQueryParam"
import { convertGlobalId } from "models/terminal/utils"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { useToast } from "../../hooks/useToast"
import { ArrowUpRight } from "../icons"

const RightSlider = dynamic(() =>
  import("../ui/RightSlider").then((mod) => mod.RightSlider),
)
const SendTokensContent = dynamic(() =>
  import("../pages/sendTokens/components/SendTokensContent").then(
    (mod) => mod.SendTokensContent,
  ),
)

const NewAutomationContent = dynamic(() =>
  import("../pages/newAutomation/components/NewAutomationContent").then(
    (mod) => mod.NewAutomationContent,
  ),
)
const BottomDrawer = dynamic(() =>
  import("../ui/BottomDrawer").then((mod) => mod.BottomDrawer),
)
const Modal = dynamic(() => import("../ui/Modal").then((mod) => mod.Modal))
const CopyAddressButton = dynamic(() =>
  import("../core/CopyAddressButton").then((mod) => mod.CopyAddressButton),
)

const TerminalActionBar = () => {
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const { address, chainId } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { successToast } = useToast()
  const [sendTokenSliderOpen, setSendTokenSliderOpen] = useState<boolean>(false)

  const closeSendTokenSlider = (isOpen: boolean) => {
    if (!isOpen) {
      removeQueryParam(router, "sendTokenSliderOpen")
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
    if (router.query.sendTokenSliderOpen) {
      setSendTokenSliderOpen(true)
      setNewAutomationSliderOpen(false)
    } else if (router.query.automationSliderOpen) {
      setNewAutomationSliderOpen(true)
      setSendTokenSliderOpen(false)
    } else {
      setSendTokenSliderOpen(false)
      setNewAutomationSliderOpen(false)
    }
  }, [router.query])

  return (
    <>
      <RightSlider open={sendTokenSliderOpen} setOpen={closeSendTokenSlider}>
        <SendTokensContent
          successCallback={() => {
            setSendTokenSliderOpen(false)
            successToast({
              message: "Created request",
            })
            const key = `/api/v1/requests?safeChainId=${chainId}&safeAddress=${address}`
            mutate(key)
          }}
        />
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white hover:bg-gray-90">
            <PlusIcon className="h-6 w-6" />
          </div>
          <span className="text-sm">Add tokens</span>
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
                  addQueryParam(router, "sendTokenSliderOpen", "true")
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white hover:bg-gray-90">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white hover:bg-gray-90">
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

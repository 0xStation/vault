import {
  DynamicConnectButton,
  useDynamicContext,
} from "@dynamic-labs/sdk-react"
import { StationLogo } from "@icons"
import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button, buttonStyles } from "@ui/Button"
import { LINKS } from "lib/constants"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import LandingBackgroundImage from "../public/images/landing-bg.webp"
import LandingImage from "../public/images/landing.webp"

type FooterNavOption = {
  label: string
  active: boolean
  href: string
}

const { ABOUT, NEWSTAND, HELP_DESK, TERMS_AND_SERVICES, TYPE_FORM } = LINKS

const options = (router: any) =>
  [
    {
      label: "About",
      active: true,
      href: ABOUT,
    },
    {
      label: "Newstand",
      active: true,
      href: NEWSTAND,
    },
    {
      label: "Help Desk",
      active: true,
      href: HELP_DESK,
    },
    {
      label: "Terms & Services",
      active: true,
      href: TERMS_AND_SERVICES,
    },
  ] as FooterNavOption[]

function Page() {
  const router = useRouter()
  const { user } = useDynamicContext()
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === "S"

  useEffect(() => {
    if (user?.blockchainAccounts?.[0]?.address) {
      router.push(`/u/${user?.blockchainAccounts?.[0]?.address}/profile`)
    }
  }, [user?.blockchainAccounts?.[0]?.address])

  return (
    <>
      <div
        className="h-screen w-screen bg-cover bg-clip-content bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${LandingBackgroundImage.src})` }}
      >
        <main className="absolute top-0 right-0 z-10 mx-5 mt-20 md:top-16 md:left-14 md:mx-0 md:mt-0 md:max-w-xl">
          <StationLogo size={isMobile ? "mobileLanding" : "landing"} />
          <p className="mt-4 mb-16 text-sm md:my-0 md:text-2xl ">
            Group wallet for your collective to raise funds, build cool shit,
            manage spend, and split revenue.
          </p>
          <div className="mx-auto block h-auto max-w-full md:hidden">
            <Image src={LandingImage} alt="Landing image" />
          </div>
          {/* <div className="fixed bottom-2 left-0 w-full space-y-2 px-5 text-center md:relative md:mt-11 md:flex md:flex-row md:space-y-0 md:px-0"> */}
          <div className="mt-11 mb-10 space-y-2 px-5 text-center md:mb-10 md:mt-11 md:flex md:flex-row">
            <DynamicConnectButton
              buttonContainerClassName={buttonStyles({
                variant: "primary",
                size: isMobile ? "base" : "xl",
                fullWidth: false,
                disabled: false,
              })}
            >
              Log in
            </DynamicConnectButton>
            <Button
              size={isMobile ? "base" : "xl"}
              variant="unemphasized"
              onClick={() => {
                router.push(TYPE_FORM)
              }}
            >
              Get early access
            </Button>
          </div>
        </main>
        <div className="bottom absolute right-52 hidden h-[730px] w-[503px] md:top-36 md:block">
          <Image src={LandingImage} alt="Landing image" />
        </div>
        <footer className="absolute bottom-10 left-14 hidden flex-row md:block">
          <ul className="flex flex-row space-x-12 text-sm">
            {options(router).map((option, idx) => {
              return (
                <li key={`link-${idx}`}>
                  <Link href={option.href} className="block">
                    {option.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </footer>
      </div>
    </>
  )
}

export default Page

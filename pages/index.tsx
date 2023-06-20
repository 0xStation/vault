import { useDynamicContext } from "@dynamic-labs/sdk-react"
import { StationLogo } from "@icons"
import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button } from "@ui/Button"
import { LINKS, TRACKING } from "lib/constants"
import { trackClick, trackImpression } from "lib/utils/amplitude"
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
const { EVENT_NAME, LOCATION } = TRACKING

const options = (router: any) =>
  [
    {
      label: "GroupOS",
      active: true,
      href: GROUPOS,
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
  const { isMobile } = useBreakpoint()
  const { user, setShowAuthFlow } = useDynamicContext()

  useEffect(() => {
    trackImpression(EVENT_NAME.LANDING_PAGE_SEEN, {
      location: LOCATION.LANDING,
    })
  }, [])

  useEffect(() => {
    if (user?.blockchainAccounts?.[0]?.address) {
      router.push(`/u/${user?.blockchainAccounts?.[0]?.address}/profile`)
    }
  }, [user?.blockchainAccounts?.[0]?.address])

  return (
    <>
      <div
        className="h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to top left, transparent 20%, black 100%), url(${LandingBackgroundImage.src})`,
        }}
      >
        <main className="absolute top-0 right-0 z-10 mx-5 mt-12 lg:top-16 lg:left-14 lg:mx-0 lg:mt-0 lg:max-w-xl">
          <StationLogo size={isMobile ? "mobileLanding" : "landing"} />
          <p className="mt-4 mb-8 text-sm md:text-base lg:my-0 lg:text-2xl ">
            Group wallet for on-chain operations — raise funds and manage spend.
          </p>
          <div className="mx-auto block h-auto max-w-[80%] lg:hidden">
            <Image src={LandingImage} alt="Landing image" />
          </div>

          <div className="mt-8 mb-10 space-y-2 text-center lg:mb-10 lg:flex lg:flex-row lg:space-y-0 lg:px-0">
            <Button
              size={isMobile ? "base" : "xl"}
              variant="primary"
              fullWidth={isMobile}
              onClick={() => {
                trackClick(EVENT_NAME.LOG_IN_CLICKED, {
                  location: LOCATION.LANDING,
                })
                setShowAuthFlow(true)
              }}
            >
              Connect wallet
            </Button>
            {/* Remove early access button}
            {/* <Button
              size={isMobile ? "base" : "xl"}
              variant="unemphasized"
              fullWidth={isMobile}
              onClick={() => {
                trackClick(EVENT_NAME.GET_EARLY_ACCESS_CLICKED, {
                  location: LOCATION.LANDING,
                })
                router.push(TYPE_FORM)
              }}
            >
              Get early access
            </Button> */}
          </div>
        </main>
        <div className="bottom absolute right-52 hidden h-[730px] w-[503px] lg:top-36 lg:block">
          <Image src={LandingImage} alt="Landing image" />
        </div>
        <footer className="absolute bottom-10 left-14 hidden flex-row lg:block">
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

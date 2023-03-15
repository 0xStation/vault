import {
  DynamicConnectButton,
  useDynamicContext,
} from "@dynamic-labs/sdk-react"
import { StationLogo } from "@icons"
import { useBreakpoint } from "@ui/Breakpoint/Breakpoint"
import { Button, buttonStyles } from "@ui/Button"
import { LINKS } from "lib/constants"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

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
      <main className="mx-5 mt-20 md:absolute md:top-16 md:left-14 md:mx-0 md:mt-0 md:max-w-xl">
        <StationLogo size={isMobile ? "mobileLanding" : "landing"} />
        <p className="mt-4 mb-16 text-sm md:my-0 md:text-2xl ">
          Group wallet for your collective to raise funds, build cool shit,
          manage spend, and split revenue.
        </p>
        <div className="mx-auto block h-[345px] w-[275px] grow bg-gray md:hidden">
          Image goes here
        </div>
        <div className="absolute bottom-2 left-0 w-full space-y-2 px-5 text-center md:relative md:mt-11 md:flex md:flex-row md:space-y-0 md:px-0">
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
              router.push(TYPE_FORM) // TODO: constant
            }}
          >
            Get early access
          </Button>
        </div>
      </main>
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
    </>
  )
}

export default Page

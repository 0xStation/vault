import Breakpoint from "@ui/Breakpoint"
import { Network } from "@ui/Network"
import truncateString from "lib/utils"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { AccountNavBar } from "../../src/components/core/AccountNavBar"
import CopyToClipboard from "../../src/components/core/CopyToClipboard"
import { ChevronRight } from "../../src/components/icons"
import DesktopTerminalLayout from "../../src/components/terminal/DesktopTerminalLayout"
import TerminalActivationView from "../../src/components/terminalCreation/import/TerminalActivationView"
import LabelCard from "../../src/components/ui/LabelCard"
import { useIsModuleEnabled } from "../../src/hooks/safe/useIsModuleEnabled"
import useGetTerminal from "../../src/hooks/terminal/useGetTerminal"
import { getTerminalFromChainNameAndSafeAddress } from "../../src/models/terminal/terminals"
import { Terminal } from "../../src/models/terminal/types"
import { convertGlobalId } from "../../src/models/terminal/utils"

type TerminalNavOption = {
  label: string
  description: string
  active: boolean
  href: string
}

const options = (router: any) =>
  [
    {
      label: "Requests",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/requests`,
    },
    {
      label: "Assets",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/assets`,
    },
    {
      label: "Members",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/members`,
    },
    {
      label: "Automations",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/automations`,
    },
    {
      label: "About",
      description: "Description to educate users (replace this!)",
      active: true,
      href: `/${router.query.chainNameAndSafeAddress}/details`,
    },
  ] as TerminalNavOption[]

const MobileTerminalIndexPage = () => {
  const router = useRouter()
  const { chainId, address } = convertGlobalId(
    router.query.chainNameAndSafeAddress as string,
  )
  const { terminal, mutate: mutateGetTerminal } = useGetTerminal({
    chainId: chainId as number,
    address: address as string,
  })
  const { data: isModuleEnabled, isSuccess } = useIsModuleEnabled({
    address: terminal?.safeAddress,
    chainId: terminal?.chainId,
  })
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(!isModuleEnabled))

  return (
    <>
      {isSuccess && !isModuleEnabled && (
        <TerminalActivationView
          mutateGetTerminal={mutateGetTerminal}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          terminal={terminal}
        />
      )}
      <AccountNavBar />
      <section className="mt-6 px-4">
        <h1 className="text-xl font-bold">{terminal?.data?.name}</h1>
        <div className="mt-2 flex flex-row items-center space-x-1">
          <Network chainId={terminal?.chainId} />
          <span className="px-1 text-xs">·</span>
          <span className="text-xs">
            {truncateString(terminal?.safeAddress)}
          </span>
          <CopyToClipboard text={terminal?.safeAddress} />
        </div>
      </section>
      <section className="px-4">
        <div className="mt-4 grid grid-cols-2 gap-2">
          {/* TODO: get data for description (total value) */}
          <LabelCard label="Total assets value" description="TODO" />
          <LabelCard
            label="Members"
            description={String(terminal?.signers?.length)}
          />
        </div>
      </section>
      <section className="mt-4 divide-y divide-slate-300 border-t border-b border-slate-300">
        {options(router).map((option, idx) => {
          if (option.active) {
            return (
              <Link href={option.href} className="block" key={`link-${idx}`}>
                <div className="flex cursor-pointer flex-row items-center justify-between p-4 hover:bg-slate-100">
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    <span className="text-xs text-slate-500">
                      {option.description}
                    </span>
                  </div>
                  <ChevronRight />
                </div>
              </Link>
            )
          }
          return (
            <div
              className="flex flex-row items-center justify-between p-4 opacity-70"
              key={`link-${idx}`}
            >
              <div className="flex flex-col">
                <span>{option.label}</span>
                <span className="text-xs text-slate-500">
                  {option.description}
                </span>
              </div>
            </div>
          )
        })}
      </section>
    </>
  )
}

const DesktopTerminalIndexPage = ({ terminal }: { terminal: Terminal }) => {
  return <DesktopTerminalLayout terminal={terminal}></DesktopTerminalLayout>
}

const TerminalPage = ({ terminal }: { terminal: Terminal }) => {
  return (
    <Breakpoint>
      {(isMobile) => {
        if (isMobile) return <MobileTerminalIndexPage />
        return <DesktopTerminalIndexPage terminal={terminal} />
      }}
    </Breakpoint>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const chainNameAndSafeAddress = context?.params?.chainNameAndSafeAddress

  try {
    let terminal = await getTerminalFromChainNameAndSafeAddress(
      chainNameAndSafeAddress,
    )
    terminal = JSON.parse(JSON.stringify(terminal))
    return {
      props: {
        terminal: terminal,
      },
    }
  } catch (e) {
    console.error(`Error: ${e}`)
    return {
      notFound: true,
    }
  }
}

export default TerminalPage

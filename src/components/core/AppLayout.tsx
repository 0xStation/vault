import Head from "next/head"
import { ReactNode, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { useSetActiveUser } from "../../hooks/account/useSetActiveUser"
import useStore from "../../hooks/stores/useStore"
import { Toast } from "../ui/Toast"

export const AppLayout = ({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) => {
  const setActiveUser = useStore((state) => state.setActiveUser)
  const activeUser = useStore((state) => state.activeUser)
  const { address: connectedAddress } = useAccount()
  const { disconnect } = useDisconnect()

  useSetActiveUser()

  useEffect(() => {
    // log user out / disconnect them if they
    // programatically disconnect from their wallet extension
    // or if they switch accounts within their own wallet.
    const handleDisconnect = async () => {
      if (
        !connectedAddress ||
        (activeUser?.address && activeUser?.address !== connectedAddress)
      ) {
        setActiveUser(null)
        disconnect()
      }
    }
    handleDisconnect()
  }, [connectedAddress])

  return (
    <>
      <Head>
        <title>{title || "Station"}</title>
        <link rel="icon" href="/favicons/terminal-logo.svg" />
        <meta
          name="description"
          content="Doing work with people who share your mission."
        />
        <meta name="twitter:site" content="@0xStation" />
        <meta name="twitter:title" content="STATION" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="twitter:description"
          content="Toolkit for digital orgs to curate and reward the best people and projects."
        />
        <link rel="apple-touch-icon" href="/favicons/terminal-logo.svg" />
      </Head>
      {children}
      <Toast />
    </>
  )
}

export default AppLayout

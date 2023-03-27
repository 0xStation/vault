import Head from "next/head"
import { ReactNode } from "react"
import { useSetActiveUser } from "../../hooks/account/useSetActiveUser"
import { Toast } from "../ui/Toast"

export const AppLayout = ({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) => {
  useSetActiveUser()

  return (
    <>
      <Head>
        <title>{title || "Station"}</title>
        <link rel="icon" href="/favicons/terminal-logo.ico" />
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
        <link rel="apple-touch-icon" href="/favicons/terminal-logo.ico" />
      </Head>
      {children}
      <Toast />
    </>
  )
}

export default AppLayout

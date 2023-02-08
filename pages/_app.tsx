import "@rainbow-me/rainbowkit/styles.css"
import "../styles/globals.css"
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit"
import type { AppProps } from "next/app"
import NextHead from "next/head"
import * as React from "react"
import { WagmiConfig } from "wagmi"

import { chains, client } from "../src/wagmi"

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: "#AD72FF",
          accentColorForeground: "white",
          borderRadius: "small",
          fontStack: "system",
          overlayBlur: "small",
        })}
      >
        <NextHead>
          <title>My wagmi + RainbowKit App</title>
        </NextHead>

        {mounted && <Component {...pageProps} />}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App

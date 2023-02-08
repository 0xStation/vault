import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"
import type { AppProps } from "next/app"
import NextHead from "next/head"
import { useEffect, useState } from "react"
import { WagmiConfig } from "wagmi"
import "../styles/globals.css"

import { chains, client } from "../src/wagmi"

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        appInfo={{
          appName: "Station",
        }}
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
          <title>Station</title>
        </NextHead>

        {mounted && <Component {...pageProps} />}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App

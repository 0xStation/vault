import {
  DynamicContextProvider,
  FilterAndSortWallets,
} from "@dynamic-labs/sdk-react"
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector"
import type { AppProps } from "next/app"
import NextHead from "next/head"
import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { SWRConfig } from "swr"
import "../styles/globals.css"

import { LINKS, TRACKING } from "lib/constants"
import trackerInit, { initializeUser, trackEvent } from "lib/utils/amplitude"
import { useRouter } from "next/router"
import Script from "next/script"
import AppLayout from "../src/components/core/AppLayout"
import { useIsRouterLoading } from "../src/hooks/useIsRouterLoading"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const { EVENT_NAME } = TRACKING

const Spinner = () => {
  return (
    // TODO: this is shrinking to mobile size for easier demoing, fix when doing actual desktop implementation
    // specifically added: mx-auto max-w-[580px]
    <div className="mx-auto flex h-screen w-full max-w-[580px] flex-col items-center justify-center text-center align-middle">
      <div role="status">
        <svg
          className="mr-2 inline h-10 w-10 animate-spin fill-black text-gray-80"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    </div>
  )
}

const cssOverrides = `
.button--primary {
    color: #0D0E11;
    padding: 0.25rem 0.75rem 0.25rem 0.75rem;
    font-size: 1rem;
    font-weight: 500;
  }

  .button--rounded {
    border-radius: 0.25rem;
  }

  .dynamic-auth-layout__container {
    background: #0D0E11;
    box-shadow: 0 0 100px 20px #AD72FF;
  }

  .footer--border-top {
    border-top: 1px solid #4d4d4dff;
  }

  .footer {
    background: #0D0E11;
  }
`

trackerInit()

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [loading] = useIsRouterLoading()
  const router = useRouter()
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || "",
          appName: "Station",
          cssOverrides,
          socialMediaUrl: LINKS.TYPE_FORM,
          socialMediaLinkText: "Sign up for our waitlist here!",
          walletsFilter: FilterAndSortWallets([
            "metamask",
            "rainbow",
            "coinbase",
            "walletconnect",
            "zerion",
            "zengo",
          ]),
          eventsCallbacks: {
            onAuthSuccess: (args) => {
              initializeUser(args?.user?.userId as string)
              trackEvent(EVENT_NAME.USER_LOGGED_IN, {
                userId: args?.user?.userId,
              })
            },
            onLogout: (args) => {
              router.push("/")
            },
          },
        }}
      >
        <DynamicWagmiConnector>
          <NextHead>
            <title key="title">Station</title>
            <meta
              property="og:url"
              content="https://app-bzuz9upjj-0xstation.vercel.app"
            />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Station" />
            <meta
              property="og:description"
              content="Doing work with people who share your mission."
            />
            <meta
              property="og:image"
              content="https://station-images.nyc3.digitaloceanspaces.com/og-image-full.png"
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              property="twitter:domain"
              content="app-bzuz9upjj-0xstation.vercel.app"
            />
            <meta name="twitter:title" content="Station" />
            <meta
              name="twitter:description"
              content="Doing work with people who share your mission."
            />
            <meta
              name="twitter:image"
              content="https://station-images.nyc3.digitaloceanspaces.com/og-image-full.png"
            />
            <meta
              name="twitter:image"
              content="https://station-images.nyc3.digitaloceanspaces.com/og-image-full.png"
              key="twitter-image"
            />
          </NextHead>
          <Script
            id="hotjar"
            dangerouslySetInnerHTML={{
              __html: `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3429945,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
            }}
          />
          <QueryClientProvider client={queryClient}>
            {mounted &&
              (loading ? (
                <Spinner />
              ) : (
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              ))}
          </QueryClientProvider>
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </SWRConfig>
  )
}

export default App

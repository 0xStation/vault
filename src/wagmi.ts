import { getDefaultWallets } from "@rainbow-me/rainbowkit"
import { configureChains, createClient } from "wagmi"
import { goerli, mainnet } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: "My wagmi + RainbowKit App",
  chains,
})

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

export { chains }

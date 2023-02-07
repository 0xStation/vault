import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { Account } from "../src/components/core/Account";
import { NavBar } from "../src/components/NavBar";

function Page() {
  const { isConnected } = useAccount();
  return (
    <>
      <NavBar />
      <h1>wagmi + RainbowKit + Next.js</h1>

      <ConnectButton />
      {isConnected && <Account />}
    </>
  );
}

export default Page;

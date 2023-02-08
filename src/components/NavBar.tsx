import React from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import HamburgerMenuIcon from "@heroicons/react/24/solid/Bars2Icon";
import { Avatar } from "@ui/Avatar";
import { useAccount, useDisconnect } from "wagmi";
import { Account } from "./core/Account";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/Dropdown";
import { Button } from "@ui/Button";

export const NavBar = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  return (
    <nav className="flex w-full flex-row items-center justify-between border-b border-slate-300 px-4 pt-12 pb-3">
      <HamburgerMenuIcon className="h-5 w-5" />
      <DropdownMenu>
        {isConnected ? (
          <>
            <DropdownMenuTrigger>
              <Avatar
                size="md"
                pfpUrl={
                  "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7"
                }
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="focus:bg-white">
                <div className="flex flex-row items-center">
                  <Avatar
                    size="sm"
                    pfpUrl={
                      "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7"
                    }
                    className="mr-2"
                  />
                  <Account />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={() => disconnect()}>Disconnect</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </>
        ) : (
          <>
            {openConnectModal && (
              <Button size="sm" onClick={() => openConnectModal()}>
                Connect wallet
              </Button>
            )}
          </>
        )}
      </DropdownMenu>
    </nav>
  );
};

export default NavBar;

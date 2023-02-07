import React from "react";
import HamburgerIcon from "@heroicons/react/24/solid/Bars2Icon";
import { Avatar } from "@ui/Avatar";

export const NavBar = () => {
  return (
    <div className="border-black flex w-full flex-row items-center justify-between border-b px-4 pt-12 pb-3">
      <HamburgerIcon className="h-5 w-5" />
      <Avatar
        size="md"
        pfpUrl={
          "https://station-images.nyc3.digitaloceanspaces.com/e164bac8-0bc5-40b1-a15f-d948ddd4aba7"
        }
      />
    </div>
  );
};

export default NavBar;

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@ui/NavigationMenu"
import { AccountNavBar } from "../src/components/core/AccountNavBar"

function Page() {
  return (
    <>
      <AccountNavBar />
      <NavigationMenu>
        <NavigationMenuList className="mx-4 w-[calc(100vw-32px)] justify-evenly rounded-lg border border-black">
          <NavigationMenuItem
            className={navigationMenuTriggerStyle({ position: "left" })}
          >
            <NavigationMenuLink>Terminal</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <NavigationMenuLink>Requests</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={navigationMenuTriggerStyle({ position: "right" })}
          >
            <NavigationMenuLink>Activities</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default Page

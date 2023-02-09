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
      <NavigationMenu className="">
        <NavigationMenuList className="rounded-lg border border-black">
          <NavigationMenuItem className="border-r border-black">
            {/* <Link href="/docs" legacyBehavior passHref> */}
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({ position: "left" })}
            >
              Terminal
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Requests
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="border-l border-black">
            <NavigationMenuLink
              className={navigationMenuTriggerStyle({ position: "right" })}
            >
              Activities
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* </Link> */}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default Page

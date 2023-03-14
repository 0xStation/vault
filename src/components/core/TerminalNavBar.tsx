import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@ui/NavigationMenu"

export const TerminalNavBar = () => {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList className="mx-4 h-7 w-[calc(100vw-32px)] justify-evenly rounded-lg border border-black">
          <NavigationMenuItem
            className={navigationMenuTriggerStyle({
              position: "left",
              size: "sm",
            })}
          >
            <NavigationMenuLink>Terminal</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={navigationMenuTriggerStyle({ size: "sm" })}
          >
            <NavigationMenuLink>Proposals</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem
            className={navigationMenuTriggerStyle({
              position: "right",
              size: "sm",
            })}
          >
            <NavigationMenuLink>Activities</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default TerminalNavBar

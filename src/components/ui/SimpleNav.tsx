const SimpleNav = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-row justify-between divide-x overflow-hidden rounded-lg border">
      {children}
    </div>
  )
}

const NavItem = ({ label }: { label: string }) => {
  return (
    <div className="grow cursor-pointer py-[3px] text-center text-sm hover:bg-black hover:text-white">
      {label}
    </div>
  )
}

SimpleNav.NavItem = NavItem
export default SimpleNav

// example
// --------
{
  /* <SimpleNav>
  <SimpleNav.NavItem label="Terminal" />
  <SimpleNav.NavItem label="Requests" />
  <SimpleNav.NavItem label="Timeline" />
</SimpleNav> */
}

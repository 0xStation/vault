import { Tabs, TabsList, TabsTrigger } from "@ui/Tabs"

export const ProfileNavBar = ({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <Tabs className={`w-full ${className}`} defaultValue="terminals">
      <TabsList className="px-4">
        <TabsTrigger value="terminals">Terminals</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

export default ProfileNavBar

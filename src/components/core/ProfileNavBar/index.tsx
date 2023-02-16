import { Tabs, TabsList, TabsTrigger } from "@ui/Tabs"

export const ProfileNavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tabs className="w-full" defaultValue="terminals">
      <TabsList>
        <TabsTrigger value="terminals">Terminals</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

export default ProfileNavBar

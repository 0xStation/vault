import { Tabs, TabsList, TabsTrigger } from "@ui/Tabs"

export const RequestsNavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tabs className="w-full" defaultValue="needs_attention">
      <TabsList>
        <TabsTrigger value="needs_attention">Needs attention</TabsTrigger>
        <TabsTrigger value="closed">Closed</TabsTrigger>
        <TabsTrigger value="all">All</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

export default RequestsNavBar

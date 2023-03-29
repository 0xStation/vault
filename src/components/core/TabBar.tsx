import {
  FilterTabsList,
  FilterTabsTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@ui/Tabs"
import { cn } from "lib/utils"
import { addQueryParam } from "lib/utils/updateQueryParam"
import { useRouter } from "next/router"

export const TabBar = ({
  className = "",
  style,
  showBorder = false,
  defaultValue,
  options,
  children,
}: {
  className?: string
  style: "tab" | "filter"
  showBorder?: boolean
  defaultValue: string
  options: { value: string; label: string }[]
  children: React.ReactNode
}) => {
  const router = useRouter()

  return (
    <Tabs
      className={`h-full w-full ${className}`}
      value={
        (style === "tab"
          ? (router.query.tab as string)
          : (router.query.filter as string)) ?? defaultValue
      }
      onValueChange={(value) => {
        addQueryParam(router, style, value)
      }}
    >
      {style === "tab" ? (
        <TabsList
          className={cn("sticky top-0 z-10 bg-black px-4 pt-1 sm:top-[-16px]")}
        >
          {options.map((option) => (
            <TabsTrigger key={`tab-${option.value}`} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      ) : (
        // style = "filter"
        <FilterTabsList
          className={cn(
            // top-[33px] assumes that filter is used within tab to get sticky lined up right
            "sticky top-[33px] z-10 bg-black px-4 pt-4 pb-2 sm:top-[17px]",
            showBorder ? "border-b border-gray-90" : "",
          )}
        >
          {options.map((option) => (
            <FilterTabsTrigger
              key={`filter-${option.value}`}
              value={option.value}
            >
              {option.label}
            </FilterTabsTrigger>
          ))}
        </FilterTabsList>
      )}
      {children}
    </Tabs>
  )
}

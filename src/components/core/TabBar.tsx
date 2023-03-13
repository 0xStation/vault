import {
  FilterTabsList,
  FilterTabsTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@ui/Tabs"
import { cn } from "lib/utils"
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

  const updateQueryParam = (paramName: string, paramValue: string) => {
    const query = { ...router.query }
    query[paramName] = paramValue
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    )
  }

  return (
    <Tabs
      className={`w-full ${className}`}
      value={
        (style === "tab"
          ? (router.query.tab as string)
          : (router.query.filter as string)) ?? defaultValue
      }
      onValueChange={(value) => {
        updateQueryParam(style, value)
      }}
    >
      {style === "tab" ? (
        <TabsList
          className={cn(
            "sticky top-0 z-10 bg-white px-4 pt-2 sm:top-[-16px]",
            showBorder ? "border-b border-slate-200" : "",
          )}
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
            // top-[29px] assumes that filter is used within tab to get sticky lined up right
            "sticky top-[29px] z-10 bg-white px-4 py-2",
            showBorder ? "border-b border-slate-200" : "",
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

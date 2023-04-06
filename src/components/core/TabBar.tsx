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
  actionElement,
  children,
}: {
  className?: string
  style: "tab" | "filter"
  showBorder?: boolean
  defaultValue: string
  actionElement?: React.ReactNode
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
      className={`h-full w-full ${className}`}
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
        <div className="flex flex-row items-center justify-between">
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
          {actionElement}
        </div>
      )}
      {children}
    </Tabs>
  )
}

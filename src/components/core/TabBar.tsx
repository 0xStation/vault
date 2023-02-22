import {
  FilterTabsList,
  FilterTabsTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@ui/Tabs"
import { useRouter } from "next/router"

export const TabBar = ({
  className = "",
  style,
  defaultValue,
  options,
  children,
}: {
  className?: string
  style: "tab" | "filter"
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
        <TabsList className="px-4">
          {options.map((option) => (
            <TabsTrigger key={`tab-${option.value}`} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      ) : (
        // style = "filter"
        <FilterTabsList className="px-4">
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

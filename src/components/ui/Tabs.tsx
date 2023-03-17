"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "lib/utils"
import * as React from "react"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex w-full items-center space-x-6 p-1", className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    className={cn(
      "mb-[-4px] inline-flex items-center justify-center pb-1 text-base text-white disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b data-[state=active]:font-bold",
      className,
    )}
    {...props}
    ref={ref}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const FilterTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex w-full items-center space-x-2", className)}
    {...props}
  />
))
FilterTabsList.displayName = TabsPrimitive.List.displayName

const FilterTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "mb-2 inline-flex items-center justify-center rounded-full border border-gray-80 px-3 py-1 text-base text-white disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-90 data-[state=active]:font-medium",
        className,
      )}
      {...props}
      ref={ref}
    />
  )
})
FilterTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    // make content fill height with bottom buffer for empty state gray boxes
    // works on desktop and mobile!
    className={cn("h-[calc(100%-36px)]", className)}
    {...props}
    ref={ref}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export {
  Tabs,
  TabsList,
  TabsTrigger,
  FilterTabsList,
  FilterTabsTrigger,
  TabsContent,
}

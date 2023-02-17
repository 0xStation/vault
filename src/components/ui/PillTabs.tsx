"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "lib/utils"
import * as React from "react"

const PillTabs = TabsPrimitive.Root

const PillTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex w-full items-center space-x-2", className)}
    {...props}
  />
))
PillTabsList.displayName = TabsPrimitive.List.displayName

const PillTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    className={cn(
      "mb-[-4px] inline-flex items-center justify-center rounded-md border border-slate-200 px-3 py-1 text-xs text-black disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-slate-100 data-[state=active]:font-bold",
      className,
    )}
    {...props}
    ref={ref}
  />
))
PillTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const PillTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content className={cn("", className)} {...props} ref={ref} />
))
PillTabsContent.displayName = TabsPrimitive.Content.displayName

export { PillTabs, PillTabsList, PillTabsTrigger, PillTabsContent }

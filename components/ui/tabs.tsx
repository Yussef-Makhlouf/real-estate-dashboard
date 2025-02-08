"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-14 items-center justify-center rounded-xl bg-zinc-50/40 p-2",
      "backdrop-blur-sm backdrop-saturate-150",
      "dark:bg-zinc-900/40",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-2.5",
      "text-sm font-medium transition-all duration-300",
      "text-zinc-600 hover:text-zinc-900",
      "dark:text-zinc-400 dark:hover:text-zinc-100",
      "focus-visible:outline-none",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-white data-[state=active]:text-indigo-600",
      "data-[state=active]:shadow-[0_2px_20px_rgba(0,0,0,0.04)]",
      "dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400",
      "transform transition-transform",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 rounded-xl",
      "animate-in zoom-in-95 duration-300 ease-out",
      "focus-visible:outline-none",
      "data-[state=active]:animate-in data-[state=active]:fade-in-0",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

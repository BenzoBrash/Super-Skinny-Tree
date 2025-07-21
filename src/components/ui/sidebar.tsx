"use client"

import * as React from "react"
import { ChevronsLeft, ChevronsRight } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

const SIDEBAR_CONTEXT = React.createContext<{
  isCollapsed: boolean
  isMobile: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isCollapsed: false,
  isMobile: false,
  setCollapsed: () => {},
})

function useSidebar() {
  const context = React.useContext(SIDEBAR_CONTEXT)
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider")
  return context
}

interface SidebarProviderProps extends React.PropsWithChildren {
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

function SidebarProvider({
  children,
  defaultCollapsed: defaultCollapsed,
  collapsed: collapsedProp,
  onCollapseChange: onCollapseChangeProp,
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [isCollapsed, setCollapsed] = React.useState(
    collapsedProp ?? defaultCollapsed ?? false
  )

  const onCollapseChange = React.useCallback(
    (collapsed: boolean) => {
      onCollapseChangeProp?.(collapsed)
      setCollapsed(collapsed)
    },
    [onCollapseChangeProp]
  )

  React.useEffect(() => {
    if (collapsedProp !== undefined) {
      onCollapseChange(collapsedProp)
    }
  }, [collapsedProp, onCollapseChange])

  React.useEffect(() => {
    if (isMobile) {
      onCollapseChange(true)
    }
  }, [isMobile, onCollapseChange])

  return (
    <SIDEBAR_CONTEXT.Provider
      value={{
        isMobile: isMobile,
        isCollapsed: isCollapsed,
        setCollapsed: onCollapseChange,
      }}
    >
      {children}
    </SIDEBAR_CONTEXT.Provider>
  )
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()
  const collapsed = isMobile || isCollapsed
  return (
    <div
      ref={ref}
      data-collapsible={collapsed ? "icon" : "full"}
      className={cn(
        "group fixed z-20 hidden h-full w-full max-w-72 flex-col border-r bg-sidebar md:flex",
        isMobile ? "max-w-16" : "max-w-72",
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()
  const collapsed = isMobile || isCollapsed
  return (
    <div
      ref={ref}
      data-collapsible={collapsed ? "icon" : "full"}
      className={cn(
        "group flex w-full flex-col",
        collapsed
          ? "transition-all md:pl-[4.5rem]"
          : "transition-all md:pl-72",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-16 shrink-0 items-center border-b px-4",
      className
    )}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "sticky bottom-0 z-10 mt-auto shrink-0 border-t bg-sidebar px-4 py-2",
      className
    )}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-col gap-y-2 p-4", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    isActive?: boolean
    tooltip?: React.ComponentProps<typeof Tooltip>
  }
>(({ className, isActive, tooltip, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  const btn = (
    <Button
      ref={ref}
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "h-10 w-full justify-start",
        isCollapsed && "h-10 w-10 justify-center p-0",
        className
      )}
      {...props}
    />
  )
  if (!isCollapsed) {
    return btn
  }

  return (
    <Tooltip {...tooltip}>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      {tooltip?.children && (
        <TooltipContent {...tooltip} className={cn("bg-background", tooltip?.className)}>{tooltip?.children}</TooltipContent>
      )}
    </Tooltip>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { isCollapsed, setCollapsed } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn("h-10 w-10 shrink-0 p-0", className)}
      onClick={() => setCollapsed(!isCollapsed)}
      {...props}
    >
      {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}

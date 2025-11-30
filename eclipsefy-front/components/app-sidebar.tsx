"use client"

import * as React from "react"
import {
  LayoutDashboard,
  KanbanSquare,
  Palette,
  BarChart3,
  Settings,
  Rocket,
  LogOut,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/", serviceId: null }, // Always visible
  { name: "Ads Manager", icon: BarChart3, href: "/ads", serviceId: "ads" },
  { name: "Social Media", icon: Palette, href: "/social", serviceId: "social" },
  { name: "SEO", icon: Rocket, href: "/seo", serviceId: "seo" },
  { name: "Projetos", icon: KanbanSquare, href: "/projects", serviceId: "web" }, // Linked to Web service for now
  { name: "Configurações", icon: Settings, href: "/settings", serviceId: null },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const filteredItems = menuItems.filter(item => {
    if (!item.serviceId) return true; // Always show items without serviceId
    if (user?.role === 'ADMIN') return true; // Admin sees everything
    return user?.services?.[item.serviceId]; // Client sees only active services
  });

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-white/10 bg-[#030014]/60 backdrop-blur-xl">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-rajdhani tracking-wider">
            ECLIPSEFY
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.name}
                  className="data-[active=true]:bg-white/[0.08] data-[active=true]:text-white data-[active=true]:shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:bg-white/[0.04] hover:text-white text-slate-400 transition-all duration-300"
                >
                  <Link href={item.href}>
                    <item.icon className={isActive ? "text-cyan-400" : "group-hover:text-violet-400"} />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-slate-400 hover:text-white hover:bg-white/[0.04]"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

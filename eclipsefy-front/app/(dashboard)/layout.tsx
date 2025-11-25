import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#030014]">
        <AppSidebar />
        <main className="flex-1 overflow-hidden relative z-10">
           <div className="p-4 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
             <div className="md:hidden fixed top-4 left-4 z-50">
               <SidebarTrigger />
             </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

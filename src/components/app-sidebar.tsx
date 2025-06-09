 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home ,  SquareChartGantt} from "lucide-react"
import Link from "next/link"
const items = [
    {
        title: "Página Inicial",
        url: "/",
        icon: Home,
    },
    {
        title: "Projeto",
        url:"/projeto",
        icon: SquareChartGantt
    }
]

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"

export function AppSidebar() {

    
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-sm">
                    Navegação
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu className="gap-4" >
                        {items.map(item => 
                            <SidebarMenuItem className="bg-gray-200 p-2 rounded-xl"  key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link  href={item.url}>
                                    <item.icon />
                                    <span className="text-2xl">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>

                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
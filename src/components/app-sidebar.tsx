 
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


export function AppSidebar() {

    
  return (
    <Sidebar collapsible="icon" >
      <SidebarContent >
            <SidebarGroup>
                <SidebarGroupLabel className="text-sm">
                    Navegação
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu className="gap-4" >
                        {items.map(item => 
                            <SidebarMenuItem className="bg-gray-200 rounded-xl hover:bg-gray-400"  key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link className="flex"  href={item.url}>
                                    <item.icon />
                                    <span >{item.title}</span>
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
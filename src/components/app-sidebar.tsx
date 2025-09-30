'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { BookOpen, ChartSpline, Home ,  Newspaper,  SquareChartGantt, Video} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"


const items = [
    {
        title: "Página Inicial",
        url: "/",
        icon: Home,
        size: 10,
    },
    {
        title: "Projeto",
        url:"/projeto",
        icon: SquareChartGantt,
        size: 10,
    },
    {
        title: "Revistas",
        url: "/revistas",
        icon: Newspaper,
        size: 10,
    },
    {
        title: "Vídeos",
        url: "/videos",
        icon: Video,
        size: 10,
    },
    {
        title: "Material Didático",
        url: "/materiais",
        icon: BookOpen,
        size: 10,
    },
    {
        title: "Gráficos Estatísticos",
        url: "/materiais",
        icon: ChartSpline,
        size: 10,
    }
]


export function AppSidebar() {
    
    const path = usePathname();
    const { open } = useSidebar()
  

    return (
    <Sidebar collapsible="icon">
      <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-sm mb-1">
                    Navegação
                </SidebarGroupLabel>

                <SidebarGroupContent>
                    <SidebarMenu className="flex gap-2" >
                        {items.map(item => 
                            <SidebarMenuItem
                                title={item.title} 
                                className={`rounded-sm flex transition-all duration-200
                                ${open ? "w-full" : "justify-center"}
                                ${path !== item.url.slice(0,item.url.length ) ? "bg-gray-200 hover:bg-verde/70" : "bg-verde text-branco hover:bg-verde hover:text-branco"} `}
                                key={item.title}
                                aria-label={item.url}>
                                <SidebarMenuButton className={`rounded-sm `}  asChild>
                                    <Link className="flex"  href={item.url}>
                                    <item.icon size={item.size} />
                                    <span>{item.title}</span>
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
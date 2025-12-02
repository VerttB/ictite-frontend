"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/providers/UserContext";
import {
    BookOpen,
    ChartSpline,
    Handshake,
    Home,
    Newspaper,
    SquareChartGantt,
    Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
} from "./ui/dropdown-menu";

const items = [
    {
        title: "Página Inicial",
        url: "/",
        icon: Home,
        size: 10,
    },
    {
        title: "Clubes de Ciências",
        url: "/clubes",
        icon: Handshake,
        size: 10,
    },
    {
        title: "Documento ICTITE",
        url: "/projeto",
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
    },
];

export function AppSidebar() {
    const path = usePathname();
    const { open } = useSidebar();
    const { isAuthenticated, user, logoutUser } = useUserContext();

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-1 text-sm">
                        Navegação
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="flex gap-2">
                            {items.map((item) => (
                                <SidebarMenuItem
                                    title={item.title}
                                    className={`flex rounded-sm transition-all duration-200 ${open ? "w-full" : "justify-center"} ${path !== item.url.slice(0, item.url.length) ? "hover:bg-primary/70 bg-gray-200 hover:text-white" : "bg-primary hover:bg-primary text-white"} `}
                                    key={item.title}
                                    aria-label={item.url}>
                                    <SidebarMenuButton
                                        className={`rounded-sm`}
                                        asChild>
                                        <Link className="flex" href={item.url}>
                                            <item.icon size={item.size} />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="py-8">
                <SidebarGroup>
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div
                                    className={`flex min-h-8 min-w-8 items-center gap-3`}>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-300">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    {open && (
                                        <p className="text-sm font-medium">
                                            {user.username}
                                        </p>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-full">
                                <DropdownMenuLabel className="p-2 text-sm font-medium">
                                    {"Opções"}
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={logoutUser}
                                    className="cursor-pointer hover:bg-red-500 hover:text-white">
                                    Deslogar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <p
                        className={`text-xs text-gray-500 ${open ? "block" : "hidden"}`}>
                        © 2025 ICTITE
                    </p>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}

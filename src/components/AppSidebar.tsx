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
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { admItems, baseItems } from "@/core/constants/sidebar";
import { cn } from "@/lib/utils";
import { Route } from "next";

export function AppSidebar() {
    const path = usePathname();
    const { open } = useSidebar();
    const { isAuthenticated, user, logoutUser } = useUserContext();
    const isConsole = path.startsWith("/console");
    const items = [
        {
            title: "Página Inicial",
            url: "/",
            icon: Home,
            allowedRoles: ["guest", "admin"],
        },
        ...(isConsole ? admItems : baseItems),
    ];
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-1 text-sm">
                        {isConsole ? "Módulo Administrativo" : "Navegação"}
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="flex gap-2">
                            <SidebarGroupContent className="flex flex-col gap-1">
                                <SidebarGroupLabel className="sr-only">
                                    Menu
                                </SidebarGroupLabel>
                                {items.map((item) => {
                                    const isActive =
                                        path === item.url + "/" || path === item.url;

                                    return (
                                        <SidebarMenuItem
                                            className={`flex rounded-sm transition-all duration-200 ${open ? "w-full" : "justify-center"} ${path !== item.url.slice(0, item.url.length) ? "hover:bg-primary/70 bg-gray-200 hover:text-white" : "bg-primary hover:bg-primary text-white"} `}
                                            key={item.title}
                                            aria-label={item.url}>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                className={cn(
                                                    "flex rounded-sm transition-all duration-200",
                                                    open ? "w-full" : "justify-center",
                                                    isActive
                                                        ? "bg-primary hover:bg-primary text-white hover:text-white"
                                                        : "hover:bg-primary/70 bg-gray-200 hover:text-white"
                                                )}
                                                asChild>
                                                <Link
                                                    className="flex"
                                                    href={item.url as Route}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarGroupContent>
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
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    {open && (
                                        <p className="text-sm font-medium">
                                            {user.email}
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
                    <p className={cn("text-xs text-gray-500", open ? "block" : "hidden")}>
                        © 2025 ICTITE
                    </p>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}

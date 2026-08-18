"use client";

import { useState } from "react";
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/providers/UserContext";
import {
    FileText,
    ChevronDown,
    ChevronRight,
    School,
    Handshake,
    SquareChartGantt,
    Book,
    Printer,
    Home,
    BarChart3,
    LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SchoolSection =
    | "geral"
    | "visao_geral_form"
    | "escola"
    | "clubs"
    | "projects"
    | "researchers"
    | "equipments";

interface SchoolSidebarProps {
    activeSection: SchoolSection;
    onSelectSection: (section: SchoolSection) => void;
}

export function SchoolSidebar({ activeSection, onSelectSection }: SchoolSidebarProps) {
    const { open } = useSidebar();
    const { isAuthenticated, user, logoutUser } = useUserContext();
    const [isFormExpanded, setIsFormExpanded] = useState<boolean>(true);

    const formSubItems = [
        { id: "visao_geral_form" as SchoolSection, label: "Visão Geral", icon: BarChart3 },
        { id: "escola" as SchoolSection, label: "Escola", icon: School },
        { id: "clubs" as SchoolSection, label: "Clubes de Ciência", icon: Handshake },
        { id: "projects" as SchoolSection, label: "Projetos", icon: SquareChartGantt },
        { id: "researchers" as SchoolSection, label: "Pesquisadores", icon: Book },
        { id: "equipments" as SchoolSection, label: "Equipamentos", icon: Printer },
    ];

    const isFormChildActive = formSubItems.some((item) => item.id === activeSection);
    const isGeralActive = activeSection === "geral";

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-1 text-sm font-semibold">
                        Módulo Escolar
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col gap-2">
                            {/* 1. Link de Retorno para Início */}
                            <SidebarMenuItem className="flex rounded-sm transition-all duration-200">
                                <SidebarMenuButton
                                    tooltip="Página Inicial"
                                    className="flex w-full cursor-pointer rounded-sm bg-gray-200 text-gray-700 hover:bg-primary/70 hover:text-white transition-all duration-200 p-2 text-sm font-medium"
                                    asChild
                                >
                                    <Link href="/">
                                        <Home size={18} />
                                        <span>Página Inicial</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* 2. Item Independente no Topo: Geral */}
                            <SidebarMenuItem
                                className={cn(
                                    "flex rounded-sm transition-all duration-200",
                                    isGeralActive
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-primary/70 hover:text-white"
                                )}
                            >
                                <SidebarMenuButton
                                    onClick={() => onSelectSection("geral")}
                                    tooltip="Geral"
                                    className={cn(
                                        "flex w-full cursor-pointer items-center gap-2 rounded-sm p-2 text-sm font-medium transition-all duration-200",
                                        isGeralActive
                                            ? "bg-primary hover:bg-primary text-white hover:text-white font-bold"
                                            : "bg-gray-200 text-gray-700 hover:bg-primary/70 hover:text-white"
                                    )}
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Geral</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* 3. Item Pai Expandível: Formulário */}
                            <SidebarMenuItem className="flex flex-col rounded-sm transition-all duration-200">
                                <SidebarMenuButton
                                    onClick={() => setIsFormExpanded(!isFormExpanded)}
                                    tooltip="Formulário da Escola"
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-sm p-2 text-sm font-semibold transition-all duration-200 cursor-pointer",
                                        isFormChildActive
                                            ? "bg-primary text-white hover:bg-primary hover:text-white font-bold"
                                            : "bg-gray-200 text-gray-800 hover:bg-primary/70 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText size={18} />
                                        <span>Formulário</span>
                                    </div>
                                    {isFormExpanded ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </SidebarMenuButton>

                                {/* Sub-itens do Formulário (Visão Geral, Escola, Clubes, Projetos, Pesquisadores, Equipamentos) */}
                                {isFormExpanded && open && (
                                    <SidebarMenuSub className="mt-1 flex flex-col gap-1 border-l-2 border-primary/40 pl-2">
                                        {formSubItems.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = activeSection === item.id;

                                            return (
                                                <SidebarMenuSubItem key={item.id}>
                                                    <SidebarMenuSubButton
                                                        onClick={() => onSelectSection(item.id)}
                                                        className={cn(
                                                            "flex w-full cursor-pointer items-center gap-2 rounded-sm p-2 text-xs transition-all duration-200",
                                                            isActive
                                                                ? "bg-primary text-white font-bold shadow-xs hover:bg-primary hover:text-white"
                                                                : "text-gray-700 hover:bg-primary/70 hover:text-white font-medium"
                                                        )}
                                                    >
                                                        <Icon size={15} />
                                                        <span>{item.label}</span>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                )}
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="py-8">
                <SidebarGroup>
                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full">
                                <div className="flex min-h-8 min-w-8 items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-300 font-bold text-gray-700">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    {open && (
                                        <p className="text-sm font-medium truncate text-left">
                                            {user.email}
                                        </p>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-full">
                                <DropdownMenuLabel className="p-2 text-sm font-medium">
                                    Opções
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={logoutUser}
                                    className="cursor-pointer hover:bg-red-500 hover:text-white"
                                >
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

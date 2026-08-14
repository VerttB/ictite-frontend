import {
    Book,
    ChartSpline,
    Handshake,
    Home,
    Printer,
    School,
    SquareChartGantt,
} from "lucide-react";

const ANY_ROLE = ["ADMIN", "SCHOOL_ADMIN", "MANAGER", "VIEWER"];

export const baseItems = [
    {
        title: "Clubes de Ciência",
        url: "/clubes",
        icon: Handshake,
        allowedRoles: ANY_ROLE,
    },
    {
        title: "Escolas",
        url: "/escolas",
        icon: School,
        allowedRoles: ANY_ROLE,
    },
    {
        title: "Gráficos Estatísticos",
        url: "/estatisticas",
        icon: ChartSpline,
        allowedRoles: ANY_ROLE,
    },
];

export const admItems = [
    {
        title: "Escolas",
        url: "/console/v2/escolas",
        icon: School,
        allowedRoles: ["ADMIN", "SCHOOL_ADMIN"],
    },
    {
        title: "Equipamentos",
        url: "/console/v2/equipamentos",
        icon: Printer,
        allowedRoles: ["ADMIN"],
    },
    {
        title: "Pesquisadores",
        url: "/console/v2/pesquisadores",
        icon: Book,
        allowedRoles: ["ADMIN"],
    },
    {
        title: "Projetos",
        url: "/console/v2/projetos",
        icon: SquareChartGantt,
        allowedRoles: ["ADMIN"],
    },
    {
        title: "Clubes de Ciências",
        url: "/console/v2/clubes",
        icon: Handshake,
        allowedRoles: ["ADMIN"],
    },
];

export const homeItem = {
    title: "Página Inicial",
    url: "/",
    icon: Home,
    allowedRoles: ANY_ROLE,
};
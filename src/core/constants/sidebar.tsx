import {
    BookOpen,
    ChartSpline,
    Handshake,
    Home,
    Newspaper,
    School,
    SquareChartGantt,
    Video,
} from "lucide-react";

export const baseItems = [
    {
        title: "Clubes de Ciência",
        url: "/clubes",
        icon: Handshake,
        allowedRoles: ["guest", "admin"],
    },
    {
        title: "Escolas",
        url: "/escolas",
        icon: School,
        allowedRoles: ["guest", "admin"],
    },
    {
        title: "Gráficos Estatísticos",
        url: "/materiais",
        icon: ChartSpline,
        allowedRoles: ["guest", "admin"],
    },
];

export const admItems = [
    {
        title: "Escolas",
        url: "/console/v2/escolas",
        icon: Home,
        allowedRoles: ["admin"],
    },
    {
        title: "Equipamentos",
        url: "/console/v2/equipamentos",
        icon: Handshake,
        allowedRoles: ["admin"],
    },
    {
        title: "Materiais",
        url: "/console/v2/materiais",
        icon: BookOpen,
        allowedRoles: ["admin"],
    },
    {
        title: "Vídeos",
        url: "/console/v2/videos",
        icon: Video,
        allowedRoles: ["admin"],
    },
    {
        title: "Revistas",
        url: "/console/v2/revistas",
        icon: Newspaper,
        allowedRoles: ["admin"],
    },
    {
        title: "Pesquisadores",
        url: "/console/v2/pesquisadores",
        icon: Handshake,
        allowedRoles: ["admin"],
    },
    {
        title: "Projetos",
        url: "/console/v2/projetos",
        icon: SquareChartGantt,
        allowedRoles: ["admin"],
    },
    {
        title: "Clubes de Ciências",
        url: "/console/v2/clubes",
        icon: Handshake,
        allowedRoles: ["admin"],
    },
];

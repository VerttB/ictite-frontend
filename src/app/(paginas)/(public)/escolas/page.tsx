"use client";

import EscolaCard from "@/components/escola/EscolaCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { getSchools } from "@/core/service/SchoolService";

import {
    Building2,
    ChevronLeft,
    Filter,
    School as SchoolIcon,
    Loader2,
    MapIcon,
    BrainCircuit,
    LucideIcon,
    BookOpen,
} from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InfoBar from "@/components/InfoBar";
import useSWR from "swr";
import { getTerritories } from "@/core/service/IdentityTerritoryService";

export default function Escolas() {
    const [_search, setSearch] = useState("");

    const { data, isLoading, error } = useSWR("schools", () => getSchools());
    const { data: territorios } = useSWR("territorios", () => getTerritories());
    // FETCH DAS ESCOLAS

    // |=======| BUSCA INICIAL + BUSCA POR NOME |=======|

    let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = [];

    stats = [
        {
            titulo: "Escolas",
            valor: 0,
            Icon: SchoolIcon,
        },
        {
            titulo: "Territórios",
            valor: 0,
            Icon: MapIcon,
        },
        {
            titulo: "Clubes por escola",
            valor: 0,
            Icon: BrainCircuit,
        },
        {
            titulo: "Pesquisadores por escola",
            valor: 0,
            Icon: BookOpen,
        },
    ];

    const handleSearch = (query: string) => {
        setSearch(query);
    };

    if (error) {
        return (
            <div className="flex w-full flex-col items-center justify-center gap-4 py-20">
                <p className="text-red-500">
                    Erro ao carregar escolas. Tente novamente mais tarde.
                </p>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-8 py-4 sm:px-8">
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row items-center gap-5">
                <Button size={"icon"} variant={"outline"} className="cursor-pointer">
                    <ChevronLeft />
                </Button>
                <p className="text-2xl font-semibold">Escolas</p>
            </div>

            {/* |=======| DESCRIÇÃO DA PÁGINA |=======| */}
            <div className="bg-primary mx-4 mt-4 flex flex-col gap-3 rounded-md border border-blue-100 p-4 text-white shadow-sm">
                <div className="flex flex-col gap-0">
                    <h2 className="flex items-center gap-1 text-xl font-semibold">
                        <SchoolIcon size={18} />
                        Escolas que mudam a Bahia
                    </h2>
                </div>
                <p className="text-sm sm:text-base">
                    Nossa rede de escolas parceiras é a base de toda inovação produzida.
                    Explore as unidades de ensino, conheça seus laboratórios e os talentos
                    que estão mudando a realidade local através da tecnologia
                </p>
            </div>

            {/* |=======| ESTATÍSTICAS |=======| */}
            <div>
                <InfoBar data={stats} />
            </div>

            {/* |=======| BUSCA |=======| */}
            <div className="flex flex-row items-center gap-2 px-4 sm:px-0">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Buscar escola por nome..."
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="h-12 gap-2 rounded-lg border-2 px-5 font-bold">
                            <Filter size={20} />
                            <span className="hidden sm:inline">Filtrar</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Território Identidade</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {territorios?.length && territorios.length > 0 ? (
                            territorios.map((territorio) => (
                                <DropdownMenuItem
                                    key={territorio.id}
                                    className="hover:bg-primary cursor-pointer transition-all hover:text-white">
                                    {territorio.name}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem className="hover:bg-primary cursor-pointer transition-all hover:text-white">
                                Nenhum território disponível
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* |=======| LISTA DE ESCOLAS |=======| */}
            <div className="flex flex-col gap-6 px-4 sm:px-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 />
                        <h2 className="text-2xl font-semibold">Escolas Listadas</h2>
                    </div>
                    <div className="bg-secondary rounded-xl px-4 py-2 shadow-md">
                        <span className="font-medium text-white">
                            {data?.total} Escolas
                        </span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Loader2 className="mb-2 animate-spin" size={40} />
                        <p>Carregando unidades...</p>
                    </div>
                ) : (
                    <div className="mt-1 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-5">
                        {data?.items.length && data.items.length > 0 ? (
                            data.items.map((escola) => (
                                <EscolaCard key={escola.id} escola={escola} />
                            ))
                        ) : (
                            <p className="col-span-full py-10 text-center text-slate-500">
                                Nenhuma escola encontrada para sua busca.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

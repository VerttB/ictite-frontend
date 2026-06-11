"use client";

import EscolaCard from "@/components/escola/EscolaCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { getSchools } from "@/core/service/SchoolService";

import {
    Building2,
    Filter,
    School as SchoolIcon,
    Loader2,
    MapIcon,
    LucideIcon,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import MenuSuperiorPagina from "@/components/MenuSuperiorPagina";
import { toast } from "sonner";

export default function Escolas() {
    const [_search, setSearch] = useState("");
    const [territory, setTerritory] = useState("");

    const { data, isLoading, error } = useSWR(["schools", _search, territory], () =>
        getSchools({
            name: _search,
            identity_territory_id: territory !== "" ? territory : undefined,
            page: 1,
        })
    );
    const { data: territorios, error: territoriesError } = useSWR("territorios", () =>
        getTerritories()
    );
    // FETCH DAS ESCOLAS

    // |=======| BUSCA INICIAL + BUSCA POR NOME |=======|

    let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = [];

    stats = [
        {
            titulo: "Escolas",
            valor: data?.total ?? 0,
            Icon: SchoolIcon,
        },
        {
            titulo: "Territórios",
            valor: territorios?.length ?? 0,
            Icon: MapIcon,
        },
    ];

    const handleSearch = (query: string) => {
        setSearch(query);
    };

    const handleTerritory = (query: string) => {
        setTerritory(query);
        console.log(territory);
    };

    useEffect(() => {
        if (!error) return;
        toast.error(error instanceof Error ? error.message : "Erro ao carregar escolas", {
            position: "top-center",
            duration: 5000,
            closeButton: true,
        });
    }, [error]);

    useEffect(() => {
        if (!territoriesError) return;
        toast.error(
            territoriesError instanceof Error
                ? territoriesError.message
                : "Erro ao carregar territórios",
            { position: "top-center", duration: 5000, closeButton: true }
        );
    }, [territoriesError]);

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
            <MenuSuperiorPagina title="Escolas" />

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
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Território Identidade</span>
                            {territory !== "" && (
                                <div
                                    onClick={() => handleTerritory("")}
                                    className="text-muted-foreground flex cursor-pointer items-center gap-1 text-xs">
                                    <Trash2 size={15} />
                                    Limpar
                                </div>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {territorios?.length && territorios.length > 0 ? (
                            territorios.map((territorio) => (
                                <DropdownMenuItem
                                    key={territorio.id}
                                    className="hover:bg-primary cursor-pointer transition-all hover:text-white"
                                    onClick={() => handleTerritory(territorio.id)}>
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
                    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

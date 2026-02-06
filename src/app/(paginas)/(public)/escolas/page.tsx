"use client";

import EscolaCard from "@/components/escola/EscolaCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { getSchools } from "@/core/service/SchoolService";
import { School } from "@/core/domain/School";
import { Pagination } from "@/schemas/Pagination";
import { Building2, ChevronLeft, Filter, School as SchoolIcon, Loader2, MapIcon, BrainCircuit, LucideIcon, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import InfoBar from "@/components/InfoBar";

export default function Escolas() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Pagination<School>>({
        items: [],
        total: 0,
        page: 1,
        total_pages: 0,
        size: 0
    });
    const [search, setSearch] = useState("");

    

    // FETCH DAS ESCOLAS
    const fetchSchools = async (name?: string) => {
        setLoading(true);
        try {
            const response = await getSchools({ 
                name: name || "", 
                page: 1, 
                size: 12 
            });
            setData(response);
        } catch (error) {
            console.error("Erro ao carregar escolas:", error);
        } finally {
            setLoading(false);
        }
    };

    // |=======| BUSCA INICIAL + BUSCA POR NOME |=======|
    useEffect(() => {
        fetchSchools(search);
    }, [search]);

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
            <div className="flex flex-row gap-2 px-4 sm:px-0 items-center">
                <SearchBar onSearch={handleSearch} placeholder="Buscar escola por nome..." />
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button className="h-12 gap-2 px-5 rounded-lg border-2 font-bold">
                            <Filter size={20} />
                            <span className="hidden sm:inline">Filtrar</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Território Identidade</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="hover:bg-primary hover:text-white transition-all cursor-pointer">Território 01</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-primary hover:text-white transition-all cursor-pointer">Território 02</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-primary hover:text-white transition-all cursor-pointer">Território 03</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* |=======| LISTA DE ESCOLAS |=======| */}
            <div className="flex flex-col gap-6 px-4 sm:px-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Building2 />
                        <h2 className="text-2xl font-semibold">Escolas Listadas</h2>
                    </div>
                    <div className="py-2 px-4 bg-secondary rounded-xl shadow-md">
                        <span className="text-white font-medium">{data.total} Escolas</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Loader2 className="animate-spin mb-2" size={40} />
                        <p>Carregando unidades...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6
                                    justify-items-center mt-1">
                        {data.items.length > 0 ? (
                            data.items.map((escola) => (
                                <EscolaCard key={escola.id} escola={escola} />
                            ))
                        ) : (
                            <p className="col-span-full text-center py-10 text-slate-500">
                                Nenhuma escola encontrada para sua busca.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";

import EscolaCard from "@/components/escola/EscolaCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Building, Building2, ChevronLeft, Filter, School } from "lucide-react";
import { useState } from "react";
import { set } from "zod";

export default function Escolas () {

    const [search, setSearch] = useState("");

    const handleSearch = (query: string) => {
        setSearch(query);
    };

    return(
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
                        <School size={18} />
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
            
            
            {/* |=======| BUSCA |=======| */}
            <div className="flex flex-row gap-2 px-4 sm:px-0 items-center">
                <SearchBar onSearch={handleSearch} placeholder="Buscar escola" />
                <Button  className="h-12 gap-2 px-5 rounded-lg border-2 font-bold">
                    <Filter size={20} />
                    <span className="hidden sm:inline">Filtrar</span>
                </Button>
            </div>

            {/* |=======| LISTA DE ESCOLAS |=======| */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Building2 />
                        <h2 className="text-2xl font-semibold">
                            Escolas Listadas
                        </h2>
                    </div>
                    <div className="py-2 px-4 bg-secondary rounded-xl shadow-md">
                        <span className="text-white">X Escolas</span>
                    </div>
                </div>

                <div>
                    <EscolaCard />
                </div>

            </div>

        </div>
    )
}
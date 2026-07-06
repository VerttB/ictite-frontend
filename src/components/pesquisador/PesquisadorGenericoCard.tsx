"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SugestionBase } from "@/core/interface/SugestionBase";
import { Route } from "next";
import { Button } from "../ui/button";

// Criamos uma interface específica para o pesquisador estendendo a base
interface ResearcherSugestion extends SugestionBase {
    lattes_id?: string | null;
}

interface GenericListProps {
    searchResult: ResearcherSugestion[]; // Atualizado para usar a interface com lattes_id
    icon: React.ReactNode;
}

export const PesquisadorGenericoCard = ({ searchResult, icon }: GenericListProps) => {
    // Verificação de segurança obrigatória antes de renderizar ou mapear
    if (!Array.isArray(searchResult) || searchResult.length === 0) {
        return <div className="p-3 text-gray-500">Nenhum resultado encontrado</div>;
    }

    return (
        <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto lg:grid-cols-2">
            {searchResult.map((result) => (
                <div
                    key={result.id}
                    className="flex h-12 w-full flex-row items-center justify-between rounded-md border-2 px-3 py-3">
                    <div className="flex flex-row items-center gap-4">
                        {icon}
                        <span className="line-clamp-1 text-lg">{result.name}</span>
                    </div>
                    <div>
                        {/* 💡 Corrigido para lattes_id (com dois 't's) */}
                        <Link
                            href={
                                `https://simcc.uesc.br/researcher?lattes_id=${result.lattes_id}` as Route
                            }
                            target="_blank">
                            <Button size={"icon"} className="cursor-pointer">
                                <ChevronRight />
                            </Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { GETictite } from "@/core/service/ICTITEService";
import { Ictite } from "@/core/interface/IIctite";
import { SearchBar } from "@/components/SearchBar";
import Mapa from "@/components/Mapa";
import { Spinner } from "@/components/LoadingSpin";
import EscolaList from "@/components/escola/EscolaList";
import { SugestionBase } from "@/core/interface/SugestionBase";
import PesquisadorLoader from "@/components/pesquisador/PesquisadorLoader";
import ProjetoLoader from "@/components/projeto/ProjetoLoader";
import ClubeCienciaLoader from "@/components/clubeCiencia/ClubeCienciaLoader";

export default function ProjetoPage() {
    const [resultadosBusca, setResultadosBusca] = useState<
        Record<string, SugestionBase[]>
    >({
        pesquisadores: [],
        escolas: [],
        projetos: [],
        clubes: [],
    });

    const handleSugestoesChange = (
        novasSugestoes: Record<string, SugestionBase[]>
    ) => {
        setResultadosBusca(novasSugestoes);
    };

    const { data: projeto, error } = useSWR<Ictite, Error>("ictite", GETictite);

    if (!projeto && !error)
        return (
            <div className="px-8 py-6">
                <Spinner size="large">Carregando...</Spinner>
            </div>
        );

    if (error)
        return (
            <div className="px-8 py-6 text-red-600">
                {error.message || "Erro ao carregar projeto"}
            </div>
        );

    return (
        <div className="space-between flex w-full flex-col gap-4 rounded-xl px-2 py-2 sm:px-8">
            <div className="flex w-full flex-row gap-4">
                <div className="bg-foreground border-border w-full rounded-md border-2 px-4 py-6 text-justify indent-4">
                    <h1 className="sm:text-sm md:text-xl">
                        {projeto?.objective}
                    </h1>
                </div>
            </div>

            <SearchBar onSugestoesChange={handleSugestoesChange} />

            {/* |=======| LISTA DAS ESCOLAS |=======| */}
            <div id="escolas" className="mt-3 mb-5 flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold">
                        Lista das Escolas
                    </h2>
                    <span className="bg-foreground cursor-default rounded-full p-1 shadow-sm transition-all hover:scale-105">
                        Total:{" "}
                        {resultadosBusca.escolas.length !== 0
                            ? resultadosBusca.escolas.length
                            : "XX"}
                    </span>
                </div>
                {/* |=======| COMPONENTE DE CARD DA ESCOLA |=======| */}
                <EscolaList escolasBusca={resultadosBusca.escolas} />
            </div>

            {/* |=======| LISTA DOS PESQUISADORES |=======| */}
            <div className="mt-3 mb-5 flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl font-semibold">
                        Lista dos Pesquisadores
                    </h2>
                    <span className="bg-foreground cursor-default rounded-full p-1 shadow-sm transition-all hover:scale-105">
                        Total: {resultadosBusca.pesquisadores.length}
                    </span>
                </div>
                {/* |=======| COMPONENTE DE CARD DOS PESQUISADORES |=======| */}
                {resultadosBusca.pesquisadores.length !== 0 ? (
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {resultadosBusca.pesquisadores.map((pesquisador) => (
                            <div key={pesquisador.id}>
                                <PesquisadorLoader suggestion={pesquisador} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <span>Nenhum resultado encontrado</span>
                    </div>
                )}
            </div>

            {/* |=======| LISTA DOS PROJETOS |=======| */}
            <div className="mt-3 mb-5 flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl font-semibold">
                        Lista dos Projetos
                    </h2>
                    <span className="bg-foreground cursor-default rounded-full p-1 shadow-sm transition-all hover:scale-105">
                        Total: {resultadosBusca.projetos.length}
                    </span>
                </div>
                {/* |=======| COMPONENTE DE CARD DOS PROJETOS |=======| */}
                {resultadosBusca.projetos.length !== 0 ? (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {resultadosBusca.projetos.map((projeto) => (
                            <div key={projeto.id} className="">
                                <ProjetoLoader sugestion={projeto} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <span>Nenhum resultado encontrado</span>
                    </div>
                )}
            </div>

            {/* |=======| LISTA DOS CLUBES |=======| */}
            <div className="mt-3 mb-5 flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl font-semibold">Lista dos Clubes</h2>
                    <span className="bg-foreground cursor-default rounded-full p-1 shadow-sm transition-all hover:scale-105">
                        Total: {resultadosBusca.clubes.length}
                    </span>
                </div>
                {/* |=======| COMPONENTE DE CARD DOS clubes |=======| */}
                {resultadosBusca.clubes.length !== 0 ? (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {resultadosBusca.clubes.map((clube) => (
                            <div key={clube.id} className="">
                                <ClubeCienciaLoader sugestion={clube} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <span>Nenhum resultado encontrado</span>
                    </div>
                )}
            </div>
            <Mapa />
        </div>
    );
}

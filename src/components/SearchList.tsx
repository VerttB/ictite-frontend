"use client";

import { useState } from "react";
import useSWR from "swr";
import { SearchBar } from "@/components/SearchBar";
import { getSchools } from "@/core/service/SchoolService";
import { getResearchers } from "@/core/service/PesquisadorService";
import { getProjects } from "@/core/service/ProjetoService";
import { getClubesCiencia } from "@/core/service/ClubeCienciaService";
import { GenericList } from "./GenericList";
import { School, PersonStanding, Projector, Club } from "lucide-react";
import { SchoolSearchParamsSchema } from "@/core/domain/School";
import { ResearcherSearchParamsSchema } from "@/core/domain/Researcher";
import { ProjectSearchParamsSchema } from "@/core/domain/Project";
import {
    ScienceClubCreateSchema,
    ScienceClubSearchParamsSchema,
} from "@/core/domain/Club";

const fetcher = async (query: string) => {
    if (!query) {
        return { escolas: [], pesquisadores: [], projetos: [], clubes: [] };
    }

    const [escolas, pesquisadores, projetos, clubes] = await Promise.all([
        getSchools(SchoolSearchParamsSchema.parse({ name: query })).then(
            (res) => res.items
        ),
        getResearchers(ResearcherSearchParamsSchema.parse({ name: query })).then(
            (res) => res.items
        ),
        getProjects(ProjectSearchParamsSchema.parse({ name: query })).then(
            (res) => res.items
        ),
        getClubesCiencia(ScienceClubSearchParamsSchema.parse({ name: query })).then(
            (res) => res.items
        ),
    ]);

    return { escolas, pesquisadores, projetos, clubes };
};

export default function SearchClient() {
    const [query, setQuery] = useState("");

    const { data } = useSWR(query, fetcher, {
        revalidateOnFocus: false,
    });

    const resultados = data || {
        escolas: [],
        pesquisadores: [],
        projetos: [],
        clubes: [],
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <SearchBar onSearch={setQuery} />

                {query ? (
                    <>
                        <SearchStats title="Escolas" count={resultados.escolas.length}>
                            <GenericList
                                searchResult={resultados.escolas}
                                path="escolas"
                                icon={<School size={24} className="text-primary" />}
                            />
                        </SearchStats>

                        <SearchStats
                            title="Pesquisadores"
                            count={resultados.pesquisadores.length}>
                            <GenericList
                                searchResult={resultados.pesquisadores}
                                path="pesquisadores"
                                icon={
                                    <PersonStanding size={24} className="text-primary" />
                                }
                            />
                        </SearchStats>

                        <SearchStats title="Projetos" count={resultados.projetos.length}>
                            <GenericList
                                searchResult={resultados.projetos}
                                path="projetos"
                                icon={<Projector size={24} className="text-primary" />}
                            />
                        </SearchStats>

                        <SearchStats title="Clubes" count={resultados.clubes.length}>
                            <GenericList
                                searchResult={resultados.clubes}
                                path="clubes"
                                icon={<Club size={24} className="text-primary" />}
                            />
                        </SearchStats>
                    </>
                ) : null}
            </div>
        </>
    );
}

interface SearchStatsProps {
    title: string;
    count: number;
    children: React.ReactNode;
}

function SearchStats({ title, count, children }: SearchStatsProps) {
    return (
        <div className="mt-6">
            <div className="mb-2 flex justify-between">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <span className="bg-foreground rounded-full p-1">Total: {count}</span>
            </div>
            <div className="grid gap-4">{children}</div>
        </div>
    );
}

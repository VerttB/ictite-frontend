"use client";

import { useState } from "react";
import ClubeCienciaCard from "@/components/clubeCiencia/ClubeCienciaCard";
import ObjetivoClubeCard from "@/components/clubeCiencia/ObjetivoClubeCard";
import InfoBar from "@/components/InfoBar";
import MenuSuperiorPagina from "@/components/MenuSuperiorPagina";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import {
    getClubesCiencia,
    getClubesCienciaStats,
} from "@/core/service/ClubeCienciaService";
import {
    BookA,
    BookOpenText,
    BrainCircuit,
    ChartBar,
    Cpu,
    FlaskConical,
    Goal,
    HeartHandshake,
    Loader2,
    LucideIcon,
    Users2,
} from "lucide-react";
import useSWR from "swr";

export default function Clubes() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading } = useSWR(
        ["clubes-ciencia", search, page],
        () =>
            getClubesCiencia({
                name: search,
                page,
                size: 12,
            }),
        {
            keepPreviousData: true,
        }
    );
    const { data: clubeCienciaStats } = useSWR("clubes-ciencia-stats", () =>
        getClubesCienciaStats()
    );

    const objetivos: { titulo: string; descricao: string; Icon: LucideIcon }[] = [
        {
            titulo: "Integração entre Estudantes e Professores",
            descricao:
                "Promover a colaboração e o trabalho em equipe entre estudantes e professores, estimulando a troca de ideias e a curiosidade científica dentro e fora da sala de aula.",
            Icon: Users2,
        },
        {
            titulo: "Fomento à Ciência e Tecnologia",
            descricao:
                "Estimular o interesse pela investigação científica e pelo uso da tecnologia como ferramenta para compreender e transformar a realidade.",
            Icon: FlaskConical,
        },
        {
            titulo: "Desenvolvimento de Projetos Inovadores",
            descricao:
                "Incentivar a criação de projetos que unam criatividade, método científico e impacto social, preparando os jovens para os desafios do futuro.",
            Icon: Cpu,
        },
    ];

    let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = [];

    stats = [
        {
            titulo: "Clubes de Ciência",
            valor: clubeCienciaStats?.total_clubes ?? 0,
            Icon: BrainCircuit,
        },
        {
            titulo: "Estudantes",
            valor: clubeCienciaStats?.total_alunos ?? 0,
            Icon: BookA,
        },
        {
            titulo: "Professores",
            valor: clubeCienciaStats?.total_professores ?? 0,
            Icon: BookOpenText,
        },
        {
            titulo: "Facilitadores",
            valor: clubeCienciaStats?.total_facilitadores ?? 0,
            Icon: HeartHandshake,
        },
        {
            titulo: "Projetos",
            valor: clubeCienciaStats?.total_projetos ?? 0,
            Icon: ChartBar,
        },
    ];

    const handleSearch = (query: string) => {
        setSearch(query);
        setPage(1);
    };

    return (
        <div className="flex w-full flex-col gap-8 py-4 sm:px-8">
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <MenuSuperiorPagina title="Clubes de Ciência" />

            {/* |=======| OBJETIVOS DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <Goal />
                    <h2 className="text-2xl font-semibold">
                        Objetivos dos Clubes de Ciência
                    </h2>
                </div>

                <div className="my-5 grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {objetivos.map((objetivo) => (
                        <ObjetivoClubeCard
                            key={objetivo.titulo}
                            titulo={objetivo.titulo}
                            descricao={objetivo.descricao}
                            Icon={objetivo.Icon}
                        />
                    ))}
                </div>
            </div>

            {/* |=======| ESTATÍSTICAS DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="w-full">
                <InfoBar data={stats} />
            </div>

            {/* |=======| BUSCA |=======| */}
            <div className="px-4 sm:px-0">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Buscar clube por nome..."
                />
            </div>

            {/* |=======| LISTAGEM DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="flex flex-col gap-4 px-4 sm:px-0">
                <div>
                    <h2 className="text-2xl font-semibold">Clubes de Ciência:</h2>
                </div>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Loader2 className="mb-2 animate-spin" size={40} />
                        <p>Carregando clubes...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {data?.items.length && data.items.length > 0 ? (
                                data.items.map((clubeCiencia) => (
                                    <ClubeCienciaCard
                                        key={clubeCiencia.id}
                                        clubeCiencia={clubeCiencia}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full py-10 text-center text-slate-500">
                                    Nenhum clube encontrado para sua busca.
                                </p>
                            )}
                        </div>
                        {data && data.total_pages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={data.total_pages}
                                onLoadMore={setPage}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

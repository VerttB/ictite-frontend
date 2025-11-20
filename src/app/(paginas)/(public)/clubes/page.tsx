"use client";

import ClubeCienciaCard from "@/components/clubeCiencia/ClubeCienciaCard";
import ObjetivoClubeCard from "@/components/clubeCiencia/ObjetivoClubeCard";
import InfoBar from "@/components/InfoBar";
import { Button } from "@/components/ui/button";
import { AllClubeCienciaStatistics } from "@/core/interface/Clube/AllClubeCienciaStatistics";
import { ClubeCiencia } from "@/core/interface/Clube/ClubeCiencia";
import {
    getClubesCiencia,
    getClubesCienciaStats,
} from "@/core/service/ClubeCienciaService";
import {
    BookA,
    BookOpenText,
    BrainCircuit,
    ChartBar,
    ChartSpline,
    ChevronLeft,
    Goal,
    HeartHandshake,
    LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

export default function Clubes() {
    const [clubeCienciaStats, setClubeCienciaStats] =
        useState<AllClubeCienciaStatistics>();

    useEffect(() => {
        const carreharClubes = async () => {
            const clubes = await getClubesCiencia();
            setClubesCiencia(clubes);
        };

        const carregarEstatisticasClubes = async () => {
            const estatisticas = await getClubesCienciaStats();
            setClubeCienciaStats(estatisticas);
        };

        carreharClubes();
        carregarEstatisticasClubes();
    }, []);

    let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = [];

    stats = [
        {
            titulo: "Clubes de Ciência",
            valor: clubeCienciaStats?.total_clubes ?? 0,
            Icon: BrainCircuit,
        },
        {
            titulo: "Alunos",
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
            titulo: "Média de alunos por clube",
            valor: clubeCienciaStats?.media_alunos ?? 0,
            Icon: ChartBar,
        },
        {
            titulo: "Média de professores por clube",
            valor: clubeCienciaStats?.media_professores ?? 0,
            Icon: ChartSpline,
        },
        {
            titulo: "Média de facilitadores por clube",
            valor: clubeCienciaStats?.media_facilitadores ?? 0,
            Icon: ChartSpline,
        },
        {
            titulo: "Média de projetos por clube",
            valor: clubeCienciaStats?.media_projetos ?? 0,
            Icon: ChartSpline,
        },
    ];

    const [clubesCiencia, setClubesCiencia] = useState<ClubeCiencia[]>([]);

    return (
        <div className="flex w-full flex-col gap-8 py-4 sm:px-8">
            {/* |=======| MENU SUPERIOR DA PÁGINA |=======| */}
            <div className="flex flex-row items-center gap-5">
                <Button
                    size={"icon"}
                    variant={"outline"}
                    className="cursor-pointer">
                    <ChevronLeft />
                </Button>
                <p className="text-2xl font-semibold">Clubes de Ciência</p>
            </div>

            {/* |=======| OBJETIVOS DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <Goal />
                    <h2 className="text-2xl font-semibold">
                        Objetivos dos Clubes de Ciência
                    </h2>
                </div>

                <div className="my-5 grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <ObjetivoClubeCard />
                    <ObjetivoClubeCard />
                    <ObjetivoClubeCard />
                </div>
            </div>

            {/* |=======| ESTATÍSTICAS DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="w-full">
                <InfoBar data={stats} />
            </div>

            {/* |=======| LISTAGEM DOS CLUBES DE CIÊNCIA |=======| */}
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">
                        Clubes de Ciência:
                    </h2>
                </div>
                <div className="grid grid-cols-1 justify-items-center gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {clubesCiencia ? (
                        clubesCiencia.map((clubeCiencia) => (
                            <ClubeCienciaCard
                                key={clubeCiencia.id}
                                clubeCiencia={clubeCiencia}
                            />
                        ))
                    ) : (
                        <div>
                            <p>Carregando...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

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
    Cpu,
    FlaskConical,
    Goal,
    HeartHandshake,
    LucideIcon,
    Users2,
} from "lucide-react";
import { useEffect, useState } from "react";

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

    const objetivos : {titulo: string; descricao: string; Icon: LucideIcon}[] = [
        {
            titulo: "Integração entre Alunos e Professores",
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
    ]

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
            titulo: "Coordenadores",
            valor: clubeCienciaStats?.total_coordenadores ?? 0,
            Icon: HeartHandshake,
        },
        {
            titulo: "Projetos",
            valor: clubeCienciaStats?.total_projetos ?? 0,
            Icon: ChartBar,
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

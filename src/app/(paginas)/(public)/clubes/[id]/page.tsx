import ClubeProjetoPesquisador from "@/components/clubeCiencia/ClubeProjetoPesquisador";
import InfoBar from "@/components/InfoBar";
import { ResearcherByType } from "@/core/domain/Researcher";
import { Project } from "@/core/domain/Project";
import { ScienceClubStatistics, ScienceClub } from "@/core/domain/Club";

import {
    getClubeCienciaById,
    getClubeCienciaProjects,
    getClubeCienciaResearchers,
    getClubeCienciaStats,
} from "@/core/service/ClubeCienciaService";

import {
    BookA,
    BookOpenText,
    HeartHandshake,
    Instagram,
    LucideIcon,
    PanelsTopLeft,
    School,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default async function OneClubeCiencia({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const clubeCiencia: ScienceClub = await getClubeCienciaById(id);
    const projects: Project[] = (await getClubeCienciaProjects(id)) ?? [];
    const researchers: ResearcherByType = (await getClubeCienciaResearchers(id)) ?? {
        Professor: [],
        Aluno: [],
        Coordenador: [],
    };

    console.log(clubeCiencia);
    /*const researchers: Researcher[] =
        (await getResearchersByClube(clubeCiencia.id)) ?? [];

    const projects: Project[] =
        (await getProjectbyClube(clubeCiencia.id)) ?? [];*/

    const statistics: ScienceClubStatistics = await getClubeCienciaStats(id);

    let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = [];

    stats = [
        {
            titulo: "Alunos",
            valor: statistics.total_alunos,
            Icon: BookA,
        },
        {
            titulo: "Professores",
            valor: statistics.total_professores,
            Icon: BookOpenText,
        },
        {
            titulo: "Coordenadores",
            valor: statistics.total_coordenadores,
            Icon: HeartHandshake,
        },
        {
            titulo: "Projetos",
            valor: statistics.total_projetos,
            Icon: PanelsTopLeft,
        },
    ];

    return (
        <div className="flex flex-col gap-8 p-8">
            {/* |=======| CABEÇALHO DO CLUBE DE CIÊNCIA |=======| */}
            <div className="flex flex-col items-center gap-5 md:flex-row">
                <div className="border-primary relative h-[100px] w-[100px] overflow-hidden rounded-full border-2 shadow-md">
                    <Image
                        src={
                            clubeCiencia.images?.[0]?.url ??
                            "https://picsum.photos/100/100"
                        }
                        alt={"Logo Clube de Ciência"}
                        fill
                        className="object-cover"></Image>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-center text-4xl font-semibold md:text-start">
                        {clubeCiencia.name}
                    </h1>
                    <div className="flex flex-col gap-2 md:flex-row">
                        <div className="text-primary flex items-center gap-2 pr-5 hover:cursor-pointer hover:underline md:border-r">
                            <School size={20} />
                            <Link href={`/escolas/${clubeCiencia.school.id}`}>
                                {clubeCiencia.school.name}
                            </Link>
                        </div>
                        <div className="text-primary flex items-center gap-2 hover:cursor-pointer hover:underline md:pl-5">
                            <Instagram size={20} />
                            <p>@instagram_clube</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* |=======| IMAGENS DO CLUBE DE CIÊNCIA |=======| */}
            <div className="flex border-t pt-4">
                <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-hidden">
                    {clubeCiencia.images?.map((image, index) => (
                        <Popover key={index}>
                            <PopoverTrigger>
                                <div className="relative h-[200px] w-[200px] cursor-pointer overflow-hidden">
                                    <Image
                                        src={image.url}
                                        alt="Clube de Ciência"
                                        fill
                                        className="object-cover object-center"></Image>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Image
                                    src={image.url}
                                    alt="Clube de Ciência"
                                    height={1000}
                                    width={1000}></Image>
                            </PopoverContent>
                        </Popover>
                    ))}
                </div>
            </div>

            {/* |=======| DESCRICAO DO CLUBE DE CIÊNCIA |=======| */}
            <div className="bg-foreground flex flex-col gap-2 rounded-md border p-3">
                <p className="border-b pb-2 text-xl font-semibold">Descrição:</p>
                <p className="">{clubeCiencia.description}</p>
            </div>

            {/* |=======| ESTATÍSTICAS DO CLUBE DE CIÊNCIA |=======| */}
            <div>
                <InfoBar data={stats} />
            </div>

            {/* |=======| PROJETOS  E PESQUISADORES DO CLUBE DE CIÊNCIA |=======| */}
            <div>
                {
                    <ClubeProjetoPesquisador
                        projects={projects}
                        pesquisador={researchers}
                    />
                }
            </div>
        </div>
    );
}

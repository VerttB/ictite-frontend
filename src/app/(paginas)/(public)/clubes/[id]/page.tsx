import ClubeProjetoPesquisador from "@/components/clubeCiencia/ClubeProjetoPesquisador";
import InfoBar from "@/components/InfoBar";
import { ClubeCiencia } from "@/core/interface/Clube/ClubeCiencia";
import { OneClubeCienciaStatstics } from "@/core/interface/Clube/OneClubeCienciaStatstics";
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { ResearcherByType } from "@/core/interface/Pesquisador/ResearcherByType";
import { Project } from "@/core/interface/Project";
import {
    getClubeCienciaById,
    getClubeCienciaProjects,
    getClubeCienciaResearchers,
    getClubeCienciaStats,
} from "@/core/service/ClubeCienciaService";
import { getResearchersByClube } from "@/core/service/PesquisadorService";
import { getProjectbyClube } from "@/core/service/ProjetoService";
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

export default async function OneClubeCiencia({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const clubeCiencia: ClubeCiencia = await getClubeCienciaById(id);
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

    const statistics: OneClubeCienciaStatstics = await getClubeCienciaStats(id);

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
            <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full border-2 border-primary shadow-md">
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
                    <h1 className="text-4xl font-semibold text-center md:text-start">
                        {clubeCiencia.name}
                    </h1>
                    <div className="flex flex-col md:flex-row gap-2 ">
                        <div className="text-primary flex items-center gap-2 md:border-r pr-5 hover:cursor-pointer hover:underline  ">
                            <School size={20} />
                            <Link href={`/escolas/${clubeCiencia.school.id}`}>
                                {clubeCiencia.school.name}
                            </Link>
                        </div>
                        <div className="text-primary flex items-center gap-2 md:pl-5 hover:cursor-pointer hover:underline">
                            <Instagram size={20} />
                            <p>@instagram_clube</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* |=======| IMAGENS DO CLUBE DE CIÊNCIA |=======| */}
            <div className="flex pt-4 border-t">
                <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-hidden">
                    {clubeCiencia.images?.map((image, index) => (
                        <div key={index} className="relative w-[200px] h-[200px] overflow-hidden">
                            <Image
                                src={image.url}
                                alt="Clube de Ciência"
                                fill
                                className="object-cover object-center"></Image>
                        </div>
                    ))}
                </div>
            </div>

            {/* |=======| DESCRICAO DO CLUBE DE CIÊNCIA |=======| */}
            <div className="bg-foreground flex flex-col gap-2 rounded-md border p-3">
                <p className="border-b pb-2 text-xl font-semibold">
                    Descrição:
                </p>
                <p className="">{clubeCiencia.description}</p>
            </div>

            {/* |=======| ESTATÍSTICAS DO CLUBE DE CIÊNCIA |=======| */}
            <div>
                <InfoBar data={stats} />
            </div> 

            {/* |=======| PROJETOS  E PESQUISADORES DO CLUBE DE CIÊNCIA |=======| */}
            <div>
                { <ClubeProjetoPesquisador
                    projects={projects}
                    pesquisador={researchers}
                /> }
            </div>

        </div>
    );
}

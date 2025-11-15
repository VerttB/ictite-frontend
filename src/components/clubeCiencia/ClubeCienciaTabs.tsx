"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import { Expand } from "lucide-react";
import { Project } from "@/core/interface/Project";
import CardProjeto from "../projeto/ProjetoCard";
import { useEffect, useState } from "react";
import { ClubeCiencia } from "@/core/interface/Clube/ClubeCiencia";
import { getClubesCienciaBySchool } from "@/core/service/ClubeCienciaService";
import Link from "next/link";
import { getProjectbyClube } from "@/core/service/ProjetoService";
import { getResearchersByClube } from "@/core/service/PesquisadorService";

interface ClubeCienciaTotal {
    clubeCiencia: ClubeCiencia;
    projetosClubeCiencia: Project[];
    pesquisadoresClubeCiencia: string[];
}

interface ClubeCienciaTabsProps {
    //clubeCiencia: ClubeCienciaBase;
    projetosClubeCiencia: Project[];   
    school_id: string; 
}

export default function ClubeCienciaTabs({ projetosClubeCiencia, school_id }: ClubeCienciaTabsProps) {

    const [clubesCiencia, setClubesCiencia] = useState<ClubeCiencia[]>([]);
    const [clubeCienciaTotal, setClubeCienciaTotal] = useState<ClubeCienciaTotal[]>([]);

    useEffect(() => {
        const carregarClubes = async () => {
            const clubes = await getClubesCienciaBySchool(school_id);
            setClubesCiencia(clubes);
        }

        const carregarProjetosClube = async () => {
            while(clubeCienciaTotal.length < clubesCiencia.length) {
                const projetos = await getProjectbyClube(clubesCiencia[clubeCienciaTotal.length].id);
                const researchers = await getResearchersByClube(clubesCiencia[clubeCienciaTotal.length].id)
            }
        }

        carregarClubes();
    })

    return (
        <div>
            {clubesCiencia.map((clubeCiencia) => (
                <div key={clubeCiencia.id} className="w-full h-full flex flex-col gap-5 p-6 border-t">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-font-primary">{clubeCiencia.title}</h1>
                        <Link href={`/clubes/${clubeCiencia.id}`}>
                            <Button size={"icon"} className="cursor-pointer"> <Expand /> </Button>
                        </Link>
                    </div>
                    {/* IMAGENS */}
                    <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(270px,1fr))]">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Image key={i} src={"https://picsum.photos/200/200"} alt="Clube de Ciência" width={200} height={200}></Image>
                        ))}
                    </div>
                    {/* DESCRICAO */}
                    <div className="flex flex-col gap-2 p-4 bg-foreground rounded-md border">
                        <p className="text-xl font-semibold">Descrição:</p>
                        <p className="">{clubeCiencia.description}</p>
                    </div>
                    {/* PROJETOS DO CLUBE DE CIÊNCIA */}
                    <div className="flex flex-col gap-4 border-t pt-3">
                        <h2 className="text-xl font-semibold">Projetos do Clube de Ciência:</h2>
                        <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(270px,1fr))]">
                            {projetosClubeCiencia.map((projeto, index) => (
                                <CardProjeto key={index} project={projeto} />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
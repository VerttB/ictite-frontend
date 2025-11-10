"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import { Expand } from "lucide-react";
import { Project } from "@/core/interface/Project";
import CardProjeto from "../projeto/CardProjeto";

interface ClubeCienciaBase {
    title: string;
    description: string;
}

interface ClubeCienciaTabsProps {
    //clubeCiencia: ClubeCienciaBase;
    projetosClubeCiencia: Project[];    
}

export default function ClubeCienciaTabs({ projetosClubeCiencia }: ClubeCienciaTabsProps) {

    const clubeCienciaMock : ClubeCienciaBase = {
        title:"Clube de Ciência de exemplo", description: "O clube de ciência focado em biologia desde o ensino fundamental até o ensimo superior Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, error cumque non aut atque, nobis est molestiae eaque deserunt dicta ipsum, placeat culpa repellendus quam totam sequi incidunt debitis voluptates." 
    }

    return (
        <div className="w-full h-full flex flex-col gap-5 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-font-primary">{clubeCienciaMock.title}</h1>
                <Button size={"icon"} className="cursor-pointer"> <Expand /> </Button>
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
                <p className="">{clubeCienciaMock.description}</p>
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
    );
}
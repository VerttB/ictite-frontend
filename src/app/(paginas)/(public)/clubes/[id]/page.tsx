
import InfoBar from "@/components/InfoBar";
import { ClubeCiencia } from "@/core/interface/ClubeCiencia";
import { getClubeCienciaById } from "@/core/service/ClubeCienciaService";
import { BookA, BookOpenText, Instagram, LucideIcon, PanelsTopLeft, School } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

export default async function OneClubeCiencia ( { params }: { params: Promise<{ id: string }> } ) {

    const { id } = await params;

    const clubeCiencia : ClubeCiencia = await getClubeCienciaById(id);

    let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = [];

    stats = [
        {
            titulo: "Alunos",
            valor: 100,
            Icon: BookA,
        },
        {
            titulo: "Professores",
            valor: 41,
            Icon: BookOpenText,
        },
        {
            titulo: "Projetos",
            valor: 28,
            Icon: PanelsTopLeft,
        }
    ];

    return(
        <div className="flex flex-col gap-8 p-8">

            {/* |=======| CABEÇALHO DO CLUBE DE CIÊNCIA |=======| */}
            <div className="flex gap-5 items-center">
                <div className="rounded-full border">
                    <Image src={"https://picsum.photos/100/100"} alt={"Logo Clube de Ciência"} width={100} height={100}
                    className="object-cover rounded-full"></Image>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-semibold">{clubeCiencia.title}</h1>
                    <div className="flex gap-2">
                        <div className="flex gap-2 items-center text-primary pr-5 border-r">
                            <School size={20}/>
                            <p>{clubeCiencia.school}</p>
                        </div>
                        <div className="flex gap-2 items-center text-primary pl-5">
                            <Instagram size={20}/>
                            <p>@instagram_clube</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* |=======| IMAGENS DO CLUBE DE CIÊNCIA |=======| */}
            <div className="flex">
                <div className="flex flex-wrap gap-3 overflow-x-hidden">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image key={index} src={"https://picsum.photos/200/200"} alt="Clube de Ciência" width={200} height={200}></Image>
                    ))}
                </div>
            </div>

            {/* |=======| DESCRICAO DO CLUBE DE CIÊNCIA |=======| */}
            <div className="flex flex-col gap-2 bg-foreground rounded-md border p-3">
                <p className="text-xl font-semibold pb-2 border-b">Descrição:</p>
                <p className="">{clubeCiencia.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Et nisi tempore, error quidem debitis neque expedita aut dolores quae saepe accusantium quod cum, aperiam nobis sed magni nesciunt? Delectus, pariatur.</p>
            </div>

            {/* |=======| ESTATÍSTICAS DO CLUBE DE CIÊNCIA |=======| */}
            <div>
                <InfoBar  data={stats}/>
            </div>

            
        </div>
    )
}
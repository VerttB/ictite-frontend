import React from "react";
import { PesquisadoresLista } from "@/components/pesquisador/PesquisadoresLista";
import { getProjectById, getProjectStatistics } from "@/core/service/ProjetoService";
import {
    Book,
    BrainCircuit,
    ChevronLeft,
    GraduationCap,
    Handshake,
    School,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectStatistic } from "@/core/interface/ProjectStatistic";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProjectById(id);

    const projectStatistics : ProjectStatistic = await getProjectStatistics(id);

    console.log(projectStatistics);

    if (!project)
        return <div className="px-10 py-6">Projeto não encontrado</div>;

    return (
        
        <div className="w-full p-8 ">
            
            {/* |=======| MENU SUPERIOR DE PROJETO |=======| */}
            <div className="flex flex-col gap-3 border-b pb-3">
                <div className="flex flex-row items-center gap-4">
                    <Link href={"/"}>
                        <Button size={"icon"} variant={"outline"}>
                            <ChevronLeft size={20} />
                        </Button>
                    </Link>
                    <div className="text-4xl font-semibold">{project.name}</div>
                </div>
                <div>
                    <div className="">{project.description}</div>
                    <div className="mt-2 flex flex-row items-center gap-2 text-gray-500">
                        <BrainCircuit size={16} />
                        <span className="text-sm">{project.clube.name}</span>
                    </div>
                </div>
            </div>

            {/* |=======| IMAGENS DO PROJETO |=======| */}
            <div className="overflow-y-auto pt-2 ">
                
                { project.images?.length ? (
                    <div className="flex flex-row gap-5 border-b py-7">
                        {project.images &&
                            project.images.map((image, i) => (
                                <Image
                                    key={i}
                                    src={image.url}
                                    alt={"Projeto"}
                                    width={164}
                                    height={164}
                                />
                            ))}
                    </div>
                ) : (
                    <div className="border-b pb-7 pt-5">
                        <p>Nenhuma imagem de projeto cadastrada</p>
                    </div>
                )}
            </div>

            {/* |=======| FUTURA DESCRIÇÃO LONGA + ESTATÍSTICAS |=======| */}
            <div className="mt-4 flex flex-col gap-5 lg:flex-row mb-8">
                {/* DESCRIÇÃO LONGA */}
                <div className="bg-foreground flex flex-3/4 flex-col gap-1 rounded-md border p-3">
                    <h2 className="border-b pb-2 text-xl font-semibold">
                        Descrição Longa do Projeto
                    </h2>
                    <p className="text-justify">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Amet illo ut non. Necessitatibus, iste? Odio molestiae
                        autem nulla nisi, ex quia eum! Voluptas rerum sapiente
                        suscipit dignissimos delectus nulla hic? Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Amet illo
                        ut non. Necessitatibus, iste? Odio molestiae autem nulla
                        nisi, ex quia eum! Voluptas rerum sapiente suscipit
                        dignissimos delectus nulla hic? Lorem ipsum dolor sit
                        amet consectetur adipisicing elit. Amet illo ut non.
                        Necessitatibus, iste? Odio molestiae autem nulla nisi,
                        ex quia eum! Voluptas rerum sapiente suscipit
                        dignissimos delectus nulla hic?
                    </p>
                </div>

                {/* ESTATÍSTICAS */}
                <div className="bg-foreground flex-1/4 rounded-md border p-3">
                    <h2 className="border-b pb-2 text-xl font-semibold">
                        Estatísticas
                    </h2>
                    <div className="mt-2 flex flex-col gap-4 md:flex-row lg:flex-col">
                        <div className="flex gap-2">
                            <Book />
                            <span>Professores: {projectStatistics.total_professores}</span>
                        </div>
                        <div className="flex gap-2">
                            <GraduationCap />
                            <span>Alunos: {projectStatistics.total_alunos}</span>
                        </div>
                        <div className="flex gap-2">
                            <Handshake />
                            <span>Coordenadores: {projectStatistics.total_coordenadores}</span>
                        </div>
                    </div>
                </div>
            </div>

            <PesquisadoresLista projectId={project.id} />
        </div>
    );
}

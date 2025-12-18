"use client";
import { Expand, School, X } from "lucide-react";
import { Button } from "../ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import Image from "next/image";
import CardPesquisador from "../pesquisador/PesquisadorCard";
import useSWR from "swr";
import {
    getProjectById,
    getProjectResearchers,
} from "@/core/service/ProjetoService";
import { Project } from "@/core/interface/Project";
import { capitalize } from "@/core/utils/capitalize";
import Link from "next/link";
import { useViewPort } from "@/hooks/useViewPort";
import { Spinner } from "../LoadingSpin";
import { PesquisadoresLista } from "../pesquisador/PesquisadoresLista";

interface ProjetoProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    project_id: string;
}

export default function Projeto({ isOpen, onClose, project_id }: ProjetoProps) {
    const { data: project, isLoading } = useSWR(
        `project-data-${project_id}`,
        () => getProjectById(project_id)
    );
    const { isMobile } = useViewPort();
    if (isLoading) return <Spinner />;
    if (!project) return null;
    return (
        <Drawer
            open={isOpen}
            onOpenChange={onClose}
            direction={isMobile ? "bottom" : "right"}>
            <DrawerContent className="w-full">
                <DrawerHeader className="shadow">
                    <div className="flex items-center justify-between border-b pb-2.5">
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => onClose(false)}
                            className="cursor-pointer">
                            <X />
                        </Button>
                        <Link href={`/projetos/${project.id}`}>
                            <Button size={"icon"} className="cursor-pointer">
                                <Expand />
                            </Button>
                        </Link>
                    </div>
                    <DrawerTitle className="text-font-primary text-2xl">
                        {project.name}
                    </DrawerTitle>
                    <DrawerDescription className="text-font-secondary">
                        {project.description}
                    </DrawerDescription>
                    {/* NOME DA ESCOLA */}
                    <div className="text-font-secondary mt-2 flex flex-row items-center gap-0.5">
                        <School size={16} />
                        <span className="text-sm">{project.school}</span>
                    </div>
                </DrawerHeader>

                {/* BODY DOS PESQUISADORES */}
                <div className="overflow-y-auto pt-2 pl-5">
                    {/* IMAGENS DO PROJETO */}
                    {/* |=======| IMAGENS DO PROJETO |=======| */}
                    <div className="overflow-y-auto pt-2 mb-4">
                        
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
                    
                    <PesquisadoresLista projectId={project_id} />
                    {/* {pesquisadores &&
                        Object.keys(pesquisadores).map((key: string) => {
                            const items =
                                pesquisadores[
                                    key as keyof typeof pesquisadores
                                ];
                            return (
                                <div
                                    key={key}
                                    className="flex flex-col gap-2 border-b pt-3 pb-7">
                                    <h2 className="text-2xl font-semibold">
                                        {capitalize(key)}
                                    </h2>
                                    <div className="grid w-full [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                        {items &&
                                            items.map((p, i) => (
                                                <Link
                                                    key={i}
                                                    href={`/pesquisadores/${p.id}`}
                                                    className="no-underline">
                                                    <CardPesquisador
                                                        key={i}
                                                        researcher={p}
                                                        onClick={() => {}}
                                                    />
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            );
                        })} */}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

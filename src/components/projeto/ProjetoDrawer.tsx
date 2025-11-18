"use client"
import { Expand, School, X } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import Image from "next/image";
import CardPesquisador from "../pesquisador/PesquisadorCard";
import useSWR from "swr";
import { getProjectResearchers } from "@/core/service/ProjetoService";
import { Project } from "@/core/interface/Project";
import { capitalize } from "@/core/utils/capitalize";
import Link from "next/link";
import { useViewPort } from "@/hooks/useViewPort";

interface ProjetoProps {
    isOpen: boolean;
    onClose: (open:boolean) => void;
    project: Project
}

export default function Projeto ({ isOpen, onClose, project } : ProjetoProps) {
    const {data : pesquisadores} = useSWR(`project-${project.id}`, () => getProjectResearchers(project.id))
    const { isMobile } = useViewPort();
    return(
        <Drawer open={isOpen} onOpenChange={onClose} direction={isMobile ? "bottom" : "right"} >
            <DrawerContent className="w-full">
                <DrawerHeader className="shadow">
                    <div className="flex justify-between border-b items-center pb-2.5 ">
                        <Button variant={"outline"} size={"icon"} onClick={() => onClose(false)} className="cursor-pointer"><X/></Button>
                        <Link href={`/projetos/${project.id}`}>
                            <Button size={"icon"} className="cursor-pointer"><Expand /></Button>
                        </Link>
                    </div>
                    <DrawerTitle className="text-2xl text-font-primary">{project.name}</DrawerTitle>
                    <DrawerDescription 
                                    className="text-font-secondary">
                                    {project.description}
                                    </DrawerDescription>
                    {/* NOME DA ESCOLA */}
                    <div className="flex flex-row gap-0.5 items-center text-font-secondary mt-2">
                        <School size={16} />
                        <span className="text-sm">{project.school}</span>
                    </div>
                </DrawerHeader>

                {/* BODY DOS PESQUISADORES */}
                <div className="pl-5 pt-2 overflow-y-auto">
                    {/* IMAGENS DO PROJETO */}
                    <div className="w-full grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(100px,1fr))]">
                        {project.images && project.images.map((image, i) => (
                            <Image key={i} src={image.path} alt={"Projeto"} width={164} height={164} />
                        ))}
                    </div>

                        {pesquisadores && Object.keys(pesquisadores).map((key:string )=> {
                            const items = pesquisadores[key as keyof typeof pesquisadores]
                            return(
                                <div key={key} className="flex flex-col gap-2 border-b pb-7 pt-3">
                                <h2 className="text-2xl font-semibold">{capitalize(key)}</h2>
                                <div className="grid w-full gap-4 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
                                {items && items.map((p,i) => 
                                        <Link  key={i} href={`/pesquisadores/${p.id}`} className="no-underline">
                                        <CardPesquisador 
                                                        key={i}
                                                        researcher={p}
                                                        onClick={() => {}}
                                                         />
                                        </Link>
                            
                            
                                )}
                        </div>              
                                </div>
                            )})}
                             
                </div>

            </DrawerContent>
            
        </Drawer>
    );
}
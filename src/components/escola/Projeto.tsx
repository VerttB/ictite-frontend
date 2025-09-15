"use client"
import { School, X } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import Image from "next/image";
import CardPesquisador from "../card/CardPesquisador";
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import useSWR from "swr";
import { getProjects, getProjectResearchers } from "@/core/service/ProjetoService";
import { Project } from "@/core/interface/Project";
import { capitalize } from "@/core/utils/capitalize";
import { useRouter } from "next/navigation";
import { getResearcherProjects } from "@/core/service/Pesquisador/PesquisadorService";

interface ProjetoProps {
    isOpen: boolean;
    onClose: (open:boolean) => void;
    project: Project
}

export default function Projeto ({ isOpen, onClose, project } : ProjetoProps) {
    const router = useRouter();
    const {data : pesquisadores} = useSWR(`project-${project.id}`, () => getProjectResearchers(project.id))
    console.log(pesquisadores)
    
    return(
        <Drawer open={isOpen} onOpenChange={onClose} direction="right" >
            <DrawerContent className="w-full">
                <DrawerHeader className="shadow">
                    <div className="flex justify-start border-b items-center pb-2.5 ">
                        <Button variant={"outline"} size={"icon"} onClick={() => onClose(false)} className="cursor-pointer"><X/></Button>
                    </div>
                    <DrawerTitle className="text-2xl">{project.name}</DrawerTitle>
                    <DrawerDescription>{project.description}</DrawerDescription>
                    {/* NOME DA ESCOLA */}
                    <div className="flex flex-row gap-0.5 items-center text-gray-500 mt-2">
                        <School size={16} />
                        <span className="text-sm">{project.school}</span>
                    </div>
                </DrawerHeader>

                {/* BODY DOS PESQUISADORES */}
                <div className="pl-5 pt-2 overflow-y-auto">
                    {/* IMAGENS DO PROJETO */}
                    <div className="flex flex-row gap-5 py-7 border-b">
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={100} height={100}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={100} height={100}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={100} height={100}></Image>
                        <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={100} height={100}></Image>
                    </div>

                        {pesquisadores && Object.keys(pesquisadores).map((key:string )=> {
                            const items = pesquisadores[key as keyof typeof pesquisadores]
                            return(
                                <div key={key} className="flex flex-col gap-2 border-b pb-7 pt-3">
                                <h2 className="text-2xl font-semibold">{capitalize(key)}</h2>
                                <div className="flex flex-row gap-5 ">
                                {items && items.map((p,i) => 
                                        <CardPesquisador 
                                                        key={i}
                                                        researcher={p}
                                                        onClick={() => router.push(`/pesquisadores/${p.id}`)} />
                            
                            
                                )}
                        </div>              
                                </div>
                            )})}
                             
                </div>

            </DrawerContent>
            
        </Drawer>
    );
}
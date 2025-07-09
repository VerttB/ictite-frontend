'use client'
import { House, MapPin, PanelsTopLeft, Printer } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import CardPesquisador from "../card/CardPesquisador";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import Pesquisador from "./Pesquisador";
import CardEquipamento from "../card/CardEquipamento";
import CardProjeto from "../card/CardProjeto";
import { SchoolData } from "@/core/interface/School";
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { Project } from "@/core/interface/Project";
import { useFetch } from "@/hooks/useFetch";
import { ResearchSIMCC } from "@/core/interface/Pesquisador/ResearcherSIMCC";
import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";

type EscolaProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string
};

export default function Escola ({open, onOpenChange, schoolId}:EscolaProps) {

    const [activeTab, setActiveTab] = useState("pesquisadores");
    const [isPesquisadorDrawerOpen, setIsPesquisadorDrawerOpen] = useState(false);
    const [isProjetoDrawerOpen, setIsProjetoDrawerOpen] = useState(false);

    const { data:school, loading: loadingSchool } = useFetch<SchoolData>(`/api/school/${schoolId}`);
    const { data: researchers, loading: loadingResearchers } = useFetch<ResearcherFinal[]>(`/api/school/${schoolId}/researchers`);
    // const { data: projects, loading: loadingProjects } = useFetch<Project[]>(`/api/school/${schoolId}/projects`);

    console.log(researchers)
   
    if(loadingSchool) return <p>Carregando....</p>
    if(!school || !researchers) return <p>Escola n encontrada</p>
    return(
        <div>
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="h-[95vh] flex flex-col">
                        
                    <DrawerHeader className="">
                        <div className="flex flex-col gap-4 items-center">
                            {/* IMAGEM */}
                            <div className="">
                                <Image width={100} height={100} src={"https://picsum.photos/100/100"} alt="escola"
                                    className="rounded-md border border-cinza">
                                </Image>
                            </div>
                            {/* TÍTULO E SUBTÍTULO */}
                            <div className="flex flex-col gap-2 items-center">
                                <DrawerTitle className="text-2xl font-bold">{school.name}</DrawerTitle>
                                <div className="flex flex-row gap-1 items-center">
                                    <MapPin size={15} />
                                    <DrawerDescription className="font-semibold">{school.city}</DrawerDescription>
                                </div>
                            </div>
                        </div>
                    </DrawerHeader>

                    {/* CORPO DO DRAWER */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="py-4 px-12 overflow-y-auto">
                            {/* DESCRIÇÃO */}
                            <div className="text-sm mb-2 font-semibold text-justify text-gray-400">
                                <p >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores earum quis in quos vel sequi exercitationem assumenda, quasi distinctio. Autem nostrum laboriosam harum aliquid assumenda nesciunt voluptatibus velit eveniet? Quisquam?</p>
                            </div>
                            {/* MENU DE BOTÕES - TABS */}
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="flex flex-row gap-5 w-full py-2 px-4 rounded-md bg-blue-100">
                                    <TabsTrigger value="pesquisadores" asChild>
                                        <Button variant={activeTab === "pesquisadores" ? "default" : "outline"}
                                            className={`gap-2 ${activeTab === "pesquisadores" ? "bg-verde text-branco  hover:bg-branco hover:text-black" : "hover:bg-verde hover:text-branco"}`}>
                                            <House/> <p>Pesquisadores</p>
                                        </Button>
                                    </TabsTrigger>
                                    <TabsTrigger value="equipamentos" asChild>
                                        <Button variant={activeTab === "equipamentos" ? "default" : "outline"}
                                            className={`gap-2 ${activeTab === "equipamentos" ? "bg-verde text-branco  hover:bg-branco hover:text-black" : "hover:bg-verde hover:text-branco"}`}>
                                            <Printer/> <p>Equipamentos</p>
                                        </Button>
                                    </TabsTrigger>
                                    <TabsTrigger value="projetos" asChild>
                                        <Button variant={activeTab === "projetos" ? "default" : "outline"}
                                            className={`gap-2 ${activeTab === "projetos" ? "bg-verde text-branco hover:bg-branco hover:text-black" : "hover:bg-verde hover:text-branco"}`}>
                                            <PanelsTopLeft/> <p>Projetos</p>
                                        </Button>
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="pesquisadores" className="mt-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 justify-items-center">
                                          {Array.isArray(researchers) && researchers.map((r) => (
                                                        <CardPesquisador
                                                            key={r.name}
                                                            researcher={r}
                                                            onClick={() => setIsPesquisadorDrawerOpen(true)}
                                                        />
                                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="equipamentos" className="mt-4">
                                    <CardEquipamento />
                                </TabsContent>
                                <TabsContent value="projetos" className="mt-4">
                                    <CardProjeto />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </DrawerContent>

                {/* |=======| DRAWER DO PESQUISADOR |=======| */}
                <Pesquisador isOpen={isPesquisadorDrawerOpen} onClose={() => setIsPesquisadorDrawerOpen(false)} />
                
                

            </Drawer>
        </div>
    );
}
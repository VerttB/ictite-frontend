'use client'
import { House, PanelsTopLeft, Printer } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import CardPesquisador from "../card/CardPesquisador";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import Pesquisador from "./Pesquisador";
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { useFetch } from "@/hooks/useFetch";
import CardProjeto from "../card/CardProjeto";
import { Spinner } from "../LoadingSpin";
import { SchoolFull } from "@/core/interface/School/SchoolFull";
import CardEquipamento from "../card/CardEquipamento";

type EscolaProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string
};

export default function Escola ({open, onOpenChange, schoolId}:EscolaProps) {
   
    const [activeTab, setActiveTab] = useState("pesquisadores");
    const [isPesquisadorDrawerOpen, setIsPesquisadorDrawerOpen] = useState(false);
    const [isProjetoDrawerOpen, setIsProjetoDrawerOpen] = useState(false);
    const { data:school, loading: loadingSchool } = useFetch<SchoolFull>(`/api/school/${schoolId}`);
    const [ selectedReseacher, setSelectedResearcher ] = useState<Researcher | null>(null);

  
    const handleReseacherClick = (reseacher: Researcher) => {
        setSelectedResearcher(reseacher);
        setIsPesquisadorDrawerOpen(true)
    }
   
    // if(!school && !loadingSchool) return <p>Escola n encontrada</p>
 
    return(
        <div>
            <Drawer open={open} onOpenChange={onOpenChange}>
               <DrawerContent className="h-[95vh] flex flex-col">
                 {( loadingSchool ) ? <div className="flex flex-col justify-center h-full items-center"><DrawerTitle/>
                                        
                                        <Spinner/>
                                        <h2>Carregando Dados da Escola......</h2></div> : (
                    <div className="flex-1 overflow-y-auto px-4"> {/* FLEX-1 PARA PODER OCUPAR TODO O ESPAÇO DISPONÍVEL DO COMPONENTE */}
                        <div className="flex flex-col gap-10 px-10 mb-5">
                            <div className="flex flex-col gap-4 px-36 items-center">
                                {/* IMAGEM */}
                                <div className="">
                                    <Image width={256} height={256} src={"https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="escola"
                                        className="rounded-md border-4 border-cinza">
                                    </Image>
                                </div>
                                
                                <div className="flex flex-col gap-2 items-center">
                                    <DrawerTitle className="text-3xl font-bold">{school?.name}</DrawerTitle>
                                    <p className="text-2xl font-semibold text-gray-400">{school?.city}</p>
                                </div>
                                <div className="text-2xl font-semibold text-gray-400">
                                    <p >{school?.description}</p>
                                </div>
                            </div>
                            
                            <div>
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
                                        <div className="flex flex-wrap gap-4 justify-items-center">
                                           {school?.researchers.map((r) => (
                                                        <CardPesquisador
                                                            key={r.name}
                                                            researcher={r}
                                                            onClick={() => handleReseacherClick(r)}
                                                        />
                                                        ))}

                                        </div>
                                    </TabsContent>
                                    <TabsContent value="equipamentos" className="mt-4 flex flex-wrap gap-4">
                                        {school?.equipment.map((e,i) => (
                                            <CardEquipamento 
                                                    key={i}
                                                    equipment={e}/>
                                        ))}
                                    </TabsContent>
                                    <TabsContent value="projetos" className="mt-4 flex flex-wrap gap-4">
                               
                                        {school?.projects?.map((p,i) =>
                                                            <CardProjeto 
                                                            key={i}
                                                            project={p}
                                                            /> )}
                                        
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                 )}
                </DrawerContent>
                
                
                {selectedReseacher && <Pesquisador isOpen={isPesquisadorDrawerOpen} researcher={selectedReseacher} onClose={() => setIsPesquisadorDrawerOpen(false)} />}
                
                

            </Drawer>
        </div>
    );
}
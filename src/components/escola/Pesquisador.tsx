import Image from "next/image";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { House, MapPin, PanelsTopLeft, Printer, X } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import CardProjeto from "../card/CardProjeto";
import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";

interface PesquisadorProps {
    isOpen: boolean;
    onClose: (open:boolean) => void;
    reseacher: ResearcherFinal | null;
}

export default function Pesquisador ({ isOpen, onClose, reseacher } : PesquisadorProps) {
    // |=======| ESTADO DO TAB |=======|
    const [activePesquisadorTab, setActivePesquisadorTab] = useState("artigos");
    if(!reseacher) return
    return(
        <Drawer open={isOpen} onOpenChange={onClose} direction="right" >
            <DrawerContent>
                <DrawerHeader className="shadow">
                    <div className="flex justify-start border-b items-center pb-2.5 ">
                        <Button variant={"outline"} size={"icon"} onClick={() => onClose(false)} className="cursor-pointer"><X/></Button>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <div>
                            <Image width={100} height={100} src={reseacher.image || "https://picsum.photos/100/100"} alt="escola"
                                className="rounded-md border border-cinza">
                            </Image>
                        </div>
                        <div className="items-center">
                            <DrawerTitle>{reseacher.name}</DrawerTitle>
                            <div className="flex flex-row gap-1 items-center">
                                <MapPin size={15} />
                                <DrawerDescription className="font-semibold">{reseacher.schoolcity}</DrawerDescription>
                            </div>
                        </div>
                    </div>
                </DrawerHeader>

                {/* CORPO DO DRAWER */}
                <div className="flex-1 flex flex-col p-2 overflow-hidden overflow-y-auto">
                    <div className="text-sm text-justify text-gray-500 ">
                        <p className="line-clamp-4 hover:line-clamp-none">{reseacher.simcc.abstract ||"Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae at earum nostrum saepe recusandae quos. Architecto magni fugiat quia, tenetur voluptas voluptatem sequi ipsa eaque dolores. Voluptas itaque velit a?"}</p>
                    </div>
                    {/* BOTÕES DE NAVEGAÇÃO DO PESQUISADOR - TABS */}
                    <Tabs value={activePesquisadorTab} onValueChange={setActivePesquisadorTab}>
                        <TabsList className="flex flex-row gap-5 w-full py-2 px-4 h-12 rounded-md bg-blue-100">
                            <TabsTrigger value="artigos" asChild>
                                <Button variant={activePesquisadorTab === "artigos" ? "default" : "outline"}
                                    className={`px-3 py-1 text-zinc-700 hover:bg-verde hover:text-branco
                                                data-[state=active]:bg-verde data-[state=active]:text-branco`}>
                                    <House/> <p>Artigos</p>
                                </Button>
                            </TabsTrigger>
                            <TabsTrigger value="participacaoEventos" asChild>
                                <Button variant={activePesquisadorTab === "participacaoEventos" ? "default" : "outline"}
                                    className={`px-3 py-1 text-zinc-700 hover:bg-verde hover:text-branco
                                                data-[state=active]:bg-verde data-[state=active]:text-branco`}>
                                    <Printer/> <p>Participação Eventos</p>
                                </Button>
                            </TabsTrigger>
                            <TabsTrigger value="projetos" asChild>
                                <Button variant={activePesquisadorTab === "projetos" ? "default" : "outline"}
                                    className={`px-3 py-1 text-zinc-700 hover:bg-verde hover:text-branco
                                                data-[state=active]:bg-verde data-[state=active]:text-branco`}>
                                    <PanelsTopLeft/> <p>Projetos</p>
                                </Button>
                            </TabsTrigger>
                            <TabsTrigger value="livros e capitulos" asChild>
                                <Button variant={activePesquisadorTab === "livros e capitulos" ? "default" : "outline"}
                                    className={`px-3 py-1 text-zinc-700 hover:bg-verde hover:text-branco
                                                data-[state=active]:bg-verde data-[state=active]:text-branco`}>
                                    <PanelsTopLeft/> <p>Livros e Capítulos</p>
                                </Button>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="artigos" className="mt-4">
                            <p>Artigos</p>
                        </TabsContent>
                        <TabsContent value="participacaoEventos" className="mt-4">
                            <p>Participação Eventos</p>
                        </TabsContent>
                        <TabsContent value="projetos" className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                {Array.from({length:6}).map((_, i) => (
                                    <CardProjeto key={i} />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="livros e capitulos" className="mt-4">
                            <p>Livros e Capítulos</p>
                        </TabsContent>
                    </Tabs>

                </div>
            </DrawerContent>
        </Drawer>
    );
}
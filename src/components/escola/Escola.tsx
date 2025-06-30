import { House, PanelsTopLeft, Printer } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import CardPesquisador from "../card/CardPesquisador";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import Pesquisador from "./Pesquisador";
import Projeto from "./Projeto";

type EscolaProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  //school: EscolaData | null;
};

export default function Escola ({open, onOpenChange}:EscolaProps) {

    const [activeTab, setActiveTab] = useState("pesquisadores");
    const [isPesquisadorDrawerOpen, setIsPesquisadorDrawerOpen] = useState(false);
    const [isProjetoDrawerOpen, setIsProjetoDrawerOpen] = useState(false);

    return(
        <div>
            <Drawer open={open} onOpenChange={onOpenChange}>
                
                <DrawerContent className="h-[95vh] flex flex-col">
                    <div className="flex-1 overflow-y-auto px-4"> {/* FLEX-1 PARA PODER OCUPAR TODO O ESPAÇO DISPONÍVEL DO COMPONENTE */}
                        <div className="flex flex-col gap-10 px-10 mb-5">
                            <div className="flex flex-col gap-4 px-36 items-center">
                                {/* IMAGEM */}
                                <div className="">
                                    <Image width={200} height={200} src={"https://picsum.photos/200/200"} alt="escola"
                                        className="rounded-md border-4 border-cinza">
                                    </Image>
                                </div>
                                {/* TÍTULO E SUBTÍTULO */}
                                <div className="flex flex-col gap-2 items-center">
                                    <DrawerTitle className="text-3xl font-bold">NOME DA ESCOLA</DrawerTitle>
                                    <p className="text-2xl font-semibold text-gray-400">CIDADE DA ESCOLA</p>
                                </div>
                                {/* DESCRIÇÃO */}
                                <div className="text-2xl font-semibold text-gray-400">
                                    <p >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores earum quis in quos vel sequi exercitationem assumenda, quasi distinctio. Autem nostrum laboriosam harum aliquid assumenda nesciunt voluptatibus velit eveniet? Quisquam?</p>
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
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 justify-items-center">
                                            <CardPesquisador onClick={() => setIsPesquisadorDrawerOpen(true)}/>
                                            <CardPesquisador onClick={() => setIsPesquisadorDrawerOpen(true)}/>
                                            <CardPesquisador onClick={() => setIsPesquisadorDrawerOpen(true)}/>
                                            <CardPesquisador onClick={() => setIsPesquisadorDrawerOpen(true)}/>
                                            <CardPesquisador onClick={() => setIsPesquisadorDrawerOpen(true)}/>
                                            <CardPesquisador onClick={() => setIsPesquisadorDrawerOpen(true)}/>
                                            <CardPesquisador onClick={() => setIsPesquisadorDrawerOpen(true)}/>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="equipamentos" className="mt-4">
                                        <p>Equipamentos</p>
                                    </TabsContent>
                                    <TabsContent value="projetos" className="mt-4">
                                        <p onClick={() => setIsProjetoDrawerOpen(true)}>Projetos</p>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </DrawerContent>

                {/* |=======| DRAWER DO PESQUISADOR |=======| */}
                <Pesquisador isOpen={isPesquisadorDrawerOpen} onClose={() => setIsPesquisadorDrawerOpen(false)} />
                
                {/* |=======| DRAWER DO PROJETO |=======| */}
                <Projeto isOpen={isProjetoDrawerOpen} onClose={() => setIsProjetoDrawerOpen(false)}/>

            </Drawer>
        </div>
    );
}
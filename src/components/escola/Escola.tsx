import { House, MapPin, PanelsTopLeft, Printer } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import CardPesquisador from "../card/CardPesquisador";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";

export default function Escola () {

    const [activeTab, setActiveTab] = useState("pesquisadores");

    return(
        <div>
            <Drawer>
                <DrawerTrigger>
                    <div className="flex flex-row gap-3 items-center h-fit w-fit hover:scale-[105%] hover:cursor-pointer transition-all duration-200 p-2 rounded">
                        <MapPin/>
                        <p className="text-xl">Salvador-BA</p>
                    </div>
                </DrawerTrigger>
                <DrawerContent className="h-[95vh] flex flex-col">
                    <div className="flex-1 overflow-y-auto px-4 py-6"> {/* FLEX-1 PARA PODER OCUPAR TODO O ESPAÇO DISPONÍVEL DO COMPONENTE */}
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
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                            <CardPesquisador />
                                            <CardPesquisador />
                                            <CardPesquisador />
                                            <CardPesquisador />
                                            <CardPesquisador />
                                            <CardPesquisador />
                                            <CardPesquisador />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="equipamentos" className="mt-4">
                                        <p>Equipamentos</p>
                                    </TabsContent>
                                    <TabsContent value="projetos" className="mt-4">
                                        <p>Projetos</p>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
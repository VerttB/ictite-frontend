import { House, MapPin, PanelsTopLeft, Printer } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import CardPesquisador from "../card/CardPesquisador";
import Image from "next/image";

export default function Escola () {
    return(
        <div>
            <Drawer>
                <DrawerTrigger>
                    <div className="flex flex-row gap-3 items-center h-fit w-fit hover:scale-[105%] hover:cursor-pointer transition-all duration-200 p-2 rounded">
                        <MapPin/>
                        <p className="text-xl">Salvador-BA</p>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="flex flex-col gap-10 px-10 mb-5">
                        <div className="flex flex-col gap-4 px-36 items-center">
                            {/* IMAGEM */}
                            <div className="">
                                <Image width={200} height={200} src={"https://picsum.photos/200/200"} alt="escola"
                                    className="rounded-md border-4 border-cinza-light">
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
                            <div className="flex flex-row gap-5 w-full py-2 px-4 rounded-md bg-blue-100">
                                <Button variant={"outline"} className="hover:bg-verde hover:text-branco"> <House/>         <p>Pesquisadores</p> </Button>
                                <Button variant={"outline"} className="hover:bg-verde hover:text-branco"> <Printer/>       <p>Equipamentos</p>  </Button>
                                <Button variant={"outline"} className="hover:bg-verde hover:text-branco"> <PanelsTopLeft/> <p>Projetos</p>      </Button>
                            </div>
                            <div>
                                <CardPesquisador />
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
import { House, MapPin, PanelsTopLeft, Printer } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";

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
                    <div className="flex flex-col gap-10 px-10">
                        <div className="flex flex-col gap-4 px-36 items-center">
                            {/* IMAGEM */}
                            <div className="bg-gray-300 h-60 w-60">

                            </div>
                            {/* TÍTULO E SUBTÍTULO */}
                            <div className="flex flex-col gap-2 items-center">
                                <p className="text-3xl font-bold">NOME DA ESCOLA</p>
                                <p className="text-2xl font-semibold text-gray-400">CIDADE DA ESCOLA</p>
                            </div>
                            {/* DESCRIÇÃO */}
                            <div className="text-2xl font-semibold text-gray-400">
                                <p >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores earum quis in quos vel sequi exercitationem assumenda, quasi distinctio. Autem nostrum laboriosam harum aliquid assumenda nesciunt voluptatibus velit eveniet? Quisquam?</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-row gap-5 w-full py-2 px-4 rounded-md bg-blue-100">
                                <Button variant={"outline"}> <House/>         <p>Pesquisadores</p> </Button>
                                <Button variant={"outline"}> <Printer/>       <p>Equipamentos</p>  </Button>
                                <Button variant={"outline"}> <PanelsTopLeft/> <p>Projetos</p>      </Button>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
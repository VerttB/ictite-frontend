import Image from "next/image";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { MapPin, X } from "lucide-react";
import { Button } from "../ui/button";

interface PesquisadorProps {
    isOpen: boolean;
    onClose: (open:boolean) => void;
}

export default function Pesquisador ({ isOpen, onClose } : PesquisadorProps) {
    return(
        <Drawer open={isOpen} onOpenChange={onClose} direction="right" >
            <DrawerContent>
                <DrawerHeader className="shadow">
                    <div className="flex justify-start border-b items-center pb-2.5">
                        <Button variant={"outline"} size={"icon"} onClick={() => onClose(false)}><X/></Button>
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <div>
                            <Image width={100} height={100} src={"https://picsum.photos/100/100"} alt="escola"
                                className="rounded-md border border-cinza">
                            </Image>
                        </div>
                        <div className="items-center">
                            <DrawerTitle>Nome do Pesquisador</DrawerTitle>
                            <div className="flex flex-row gap-1 items-center">
                                <MapPin size={15} />
                                <DrawerDescription className="font-semibold">Cidade da Escola</DrawerDescription>
                            </div>
                        </div>
                    </div>
                </DrawerHeader>

                {/* CORPO DO DRAWER */}
                <div className="flex-1 flex flex-col p-2 overflow-hidden">
                    <div className="text-sm text-justify text-gray-500 ">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur odio corporis temporibus dignissimos laborum sequi voluptates non, vitae reiciendis laudantium! Soluta provident ratione placeat. Molestiae sequi aspernatur aliquid ipsam eligendi.</p>
                    </div>
                    
                </div>
            </DrawerContent>
        </Drawer>
    );
}
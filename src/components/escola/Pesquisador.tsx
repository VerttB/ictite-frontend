import Image from "next/image";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { MapPin } from "lucide-react";

interface PesquisadorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Pesquisador ({ isOpen, onClose } : PesquisadorProps) {
    return(
        <Drawer open={isOpen} onOpenChange={onClose} >
            <DrawerContent>
                <DrawerHeader className="items-center">
                    <div>
                        <Image width={100} height={100} src={"https://picsum.photos/100/100"} alt="escola"
                            className="rounded-md border border-cinza">
                        </Image>
                    </div>
                    <DrawerTitle>Nome do Pesquisador</DrawerTitle>
                    <div className="flex flex-row gap-1 items-center">
                        <MapPin size={15} />
                        <DrawerDescription className="font-semibold">Cidade da Escola</DrawerDescription>
                    </div>
                </DrawerHeader>

                {/* CORPO DO DRAWER */}
                <div>

                </div>
            </DrawerContent>
        </Drawer>

    );
}
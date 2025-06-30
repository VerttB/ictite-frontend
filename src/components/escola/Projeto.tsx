import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface ProjetoProps {
    isOpen: boolean;
    onClose: (open:boolean) => void;
}

export default function Projeto ({ isOpen, onClose } : ProjetoProps) {
    return(
        <Drawer open={isOpen} onOpenChange={onClose} direction="right" >
            <DrawerContent className="w-full">
                <DrawerHeader>
                    <div className="flex justify-start border-b items-center pb-2.5">
                        <Button variant={"outline"} size={"icon"} onClick={() => onClose(false)}><X/></Button>
                    </div>
                    <DrawerTitle>Nome do Projeto</DrawerTitle>
                    <DrawerDescription>Descrição do Projeto: Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam dolores, officia quidem hic culpa enim quae cumque autem provident temporibus labore quibusdam, tempore odit omnis ducimus inventore voluptate obcaecati modi!</DrawerDescription>
                </DrawerHeader>
            </DrawerContent>
            
        </Drawer>
    );
}
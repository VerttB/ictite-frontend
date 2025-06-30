import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface ProjetoProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Projeto ({ isOpen, onClose } : ProjetoProps) {
    return(
        <Drawer open={isOpen} onOpenChange={onClose} direction="right" >
            <DrawerContent className="w-full">
                <DrawerHeader>
                    <DrawerTitle>Nome do Projeto</DrawerTitle>
                    <DrawerDescription>Descrição do Projeto: Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam dolores, officia quidem hic culpa enim quae cumque autem provident temporibus labore quibusdam, tempore odit omnis ducimus inventore voluptate obcaecati modi!</DrawerDescription>
                </DrawerHeader>
            </DrawerContent>
            
        </Drawer>
    );
}
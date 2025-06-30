import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface ProjetoProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Projeto ({ isOpen, onClose } : ProjetoProps) {
    return(
        <Drawer open={isOpen} onOpenChange={onClose} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Projeto</DrawerTitle>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    );
}
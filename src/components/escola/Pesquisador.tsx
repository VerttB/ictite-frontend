import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface PesquisadorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Pesquisador ({ isOpen, onClose } : PesquisadorProps) {
    return(
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Pesquisador</DrawerTitle>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>

    );
}
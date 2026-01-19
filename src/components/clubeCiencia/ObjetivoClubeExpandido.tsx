import { LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ObjetivoClubeProps {
    titulo: string;
    descricao: string;
    Icon: LucideIcon;
}

interface ObjetivoClubeExpandidoProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    objetivo: ObjetivoClubeProps;
}

export default function ObjetivoClubeExpandido ( { isOpen, onClose, objetivo } : ObjetivoClubeExpandidoProps ) {
    return(
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-foreground flex w-[400px] flex-col gap-3 rounded-md border p-4">
                    <DialogHeader className="text-primary flex flex-row items-center gap-2">
                        <objetivo.Icon className="flex-1/5"/>
                        <DialogTitle className="text-2xl font-semibold">{objetivo.titulo}</DialogTitle>
                    </DialogHeader>

                    <div className="text-justify">{objetivo.descricao}</div>
    
                </DialogContent>
            </Dialog>

    );
}
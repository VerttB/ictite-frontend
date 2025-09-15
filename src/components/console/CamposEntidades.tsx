import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { LucideIcon, X } from "lucide-react";

interface EntidadeProps {
    nome  : string;
    icon  : LucideIcon;
    campos: string[]
}

interface CamposEntidadeProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    entidade: EntidadeProps
}

export default function CamposEntidades ( { isOpen, onClose, entidade }:CamposEntidadeProps  ) {
    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="flex flex-row gap-3 items-center">
                    <entidade.icon size={35} />
                    <div>
                        <DialogTitle>{entidade.nome}</DialogTitle>
                        <div className="flex gap-1">
                            {entidade.campos.map((campo) => (
                                <div key={campo} className="text-gray-500">{campo}</div>
                            ))}
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
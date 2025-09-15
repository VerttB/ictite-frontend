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
                <DialogClose asChild>
                    <button
                        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
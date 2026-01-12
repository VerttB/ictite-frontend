import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface DeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export const DeleteConfirmationModal = ({
    open,
    onClose,
    onConfirm,
    title = "Tem certeza?",
    description = "Essa ação não pode ser desfeita.",
}: DeleteModalProps) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={onConfirm} className="bg-red-600">
                    Deletar
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

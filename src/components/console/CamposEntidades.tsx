import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { LucideIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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
                <div>
                    <Table>
                        <TableHeader className="bg-transparent">
                            <TableRow className=" *:border-border hover:bg-transparent [&>:not(:last-child)]:border-r border">
                                {entidade.campos.map((campo) => (
                                    <TableHead className="text-black text-center" key={campo}>{campo}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg border">
                            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                                {Array.from({ length: entidade.campos.length }).map((_, i) => (
                                    <TableCell  key={i} className="text-center">exemplo01</TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
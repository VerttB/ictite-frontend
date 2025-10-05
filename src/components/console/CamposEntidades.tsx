import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { LucideIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface AbaProps {
    nome: string;
    campos: string[];
}

interface EntidadeProps {
    nome  : string;
    icon  : LucideIcon;
    campos: string[];
    abas ?: AbaProps[];
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
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-3">
                        <h2 className="font-semibold">Tabela Exemplo</h2>
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
                    { entidade.abas && entidade.abas.map((aba) => (
                        <div key={aba.nome} className="flex flex-col gap-3">
                            <h2 className="font-semibold">{aba.nome}</h2>
                            <Table>
                                <TableHeader className="bg-transparent">
                                    <TableRow className=" *:border-border hover:bg-transparent [&>:not(:last-child)]:border-r border">
                                        {aba.campos.map((campo) => (
                                            <TableHead className="text-black text-center" key={campo}>{campo}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg border">
                                    <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                                        {Array.from({ length: aba.campos.length }).map((_, i) => (
                                            <TableCell  key={i} className="text-center">exemplo01</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )) 
                    }
                </div>
            </DialogContent>
        </Dialog>
    );
}
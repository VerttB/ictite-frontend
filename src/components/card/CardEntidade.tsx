"use client"

import { LucideIcon } from "lucide-react";
import CamposEntidades from "../console/CamposEntidades";
import { useState } from "react";

interface EntidadeProps {
    nome  : string;
    icon  : LucideIcon;
    campos: string[]
}

interface CardEntidadeProps {
    entidade: EntidadeProps
}

export default function CardEntidade ({ entidade }: CardEntidadeProps) { 

    const [isDialogCamposEntidadeOpen, setIsDialogCamposEntidadeOpen] = useState(false);

    return(
        <>
            <div onClick={() => setIsDialogCamposEntidadeOpen(true)}
                className="flex flex-col items-center justify-center h-28 w-28 bg-foreground rounded-sm
                            hover:shadow-sm hover:shadow-primary hover:border-2 hover:border-primary transition-all cursor-pointer">
                <entidade.icon size={50}/>
                <span className="font-semibold">{entidade.nome}</span>
            </div>
            <CamposEntidades isOpen={isDialogCamposEntidadeOpen} onClose={setIsDialogCamposEntidadeOpen} entidade={entidade} />
        </>
    );
}
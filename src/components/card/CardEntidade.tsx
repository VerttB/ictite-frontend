import { LucideIcon } from "lucide-react";

interface EntidadeProps {
    nome  : string;
    icon  : LucideIcon;
    campos: string[]
}

interface CardEntidadeProps {
    entidade: EntidadeProps
}

export default function CardEntidade ({ entidade }: CardEntidadeProps) { 
    return(
        <div className="flex flex-col items-center justify-center h-28 w-28 bg-cinza-light rounded-sm
                        hover:shadow-sm hover:shadow-verde hover:border-2 hover:border-verde transition-all cursor-pointer">
            <entidade.icon size={50}/>
            <span className="font-semibold">{entidade.nome}</span>
        </div>
    );
}
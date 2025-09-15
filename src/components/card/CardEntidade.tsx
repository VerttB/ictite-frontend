import { LucideIcon } from "lucide-react";

interface CardEntidadeProps {
  icon: LucideIcon;
  nome: string;
}

export default function CardEntidade ({ icon: Icon, nome}: CardEntidadeProps) { 
    return(
        <div className="flex flex-col items-center justify-center h-28 w-28 bg-cinza-light rounded-sm
                        hover:shadow-sm hover:shadow-verde hover:border-2 hover:border-verde transition-all cursor-pointer">
            <Icon size={50}/>
            <span className="font-semibold">{nome}</span>
        </div>
    );
}
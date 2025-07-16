import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";
import { Book } from "lucide-react";
import Image from "next/image";

interface CardPesquisadorProps {
    onClick?: () => void; // Adicione esta prop
    researcher: ResearcherFinal
}

export default function CardPesquisador ({ onClick, researcher }: CardPesquisadorProps) {
    
    return(
        <div  onClick={onClick} 
            className="relative border-2 h-[250px] w-[200px] rounded-md p-2 
                    cursor-pointer overflow-hidden bg-black group
            ">
            
            <div className={`absolute inset-0 
                     bg-cover bg-center 
                    opacity-70 group-hover:opacity-45 transition-opacity duration-300
`}>
            <Image fill alt="Imagem do pesquisador" className="rounded-t-lg object-cover" src={researcher.image || "https://picsum.photos/100/100"}/>
          </div>

            <div className="relative flex flex-col h-full justify-end gap-2">
                <div className="text-white">
                    <p className="font-semibold text-xl ">{researcher.name}</p>
                    <div className="hidden group-hover:block ">
                        <p>{researcher.sexo}</p>
                        <p>{researcher.raca}</p>
                    </div>
                </div>
                <div className=" flex items-center
                            bg-vermelho py-1 px-1.5 ml-1 rounded-md w-fit text-xl font-bold">
                    <Book size={20}/>
                    <p className="">{researcher.type}</p>
                </div>
            </div>

        </div>
    );
}
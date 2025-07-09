import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";
import { Book } from "lucide-react";
import Image from "next/image";

interface CardPesquisadorProps {
    onClick?: () => void; // Adicione esta prop
    researcher: ResearcherFinal
}

export default function CardPesquisador ({ onClick, researcher }: CardPesquisadorProps) {
    return(
        <div className="cursor-pointer" onClick={onClick}>
            <div className="relative">
                <Image width={200} height={200} src={researcher.image ?? "https://picsum.photos/200/200"} alt="pesquisador"
                    className="rounded-md border-4 border-cinza"
                ></Image>

                <div className="absolute top-25 left-0 w-full p-2">
                    <h2 className="text-white font-bold drop-shadow-md">{researcher.name}</h2>
                    <div className="flex flex-row gap-3 w-fit rounded-md bg-vermelho p-3"> <Book/> <p>{researcher.type}</p> </div>
                </div>
            </div>
        </div>
    );
}
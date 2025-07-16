import { Book } from "lucide-react";
//import Image from "next/image";

interface CardPesquisadorProps {
    onClick?: () => void; // Adicione esta prop
}

export default function CardPesquisador ({ onClick }: CardPesquisadorProps) {
    return(
        <div  onClick={onClick} 
            className="relative border-2 h-[250px] w-[200px] rounded-md p-2 
                    cursor-pointer overflow-hidden bg-black group
            ">
            
            <div className="absolute inset-0 
                    bg-[url('https://picsum.photos/200/250')] bg-cover bg-center 
                    opacity-70 group-hover:opacity-45 transition-opacity duration-300
          ">
          </div>

            <div className="relative flex flex-col h-full justify-end gap-2">
                <div className="text-white">
                    <p className="font-semibold text-xl ">Nome do pesquisador</p>
                    <div className="hidden group-hover:block ">
                        <p>Masculino</p>
                        <p>Indigina</p>
                    </div>
                </div>
                <div className=" flex items-center
                            bg-vermelho py-1 px-1.5 ml-1 rounded-md w-fit text-xl font-bold">
                    <Book size={20}/>
                    <p className="">Professor</p>
                </div>
            </div>

        </div>
    );
}
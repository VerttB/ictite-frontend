'use client'
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { Book } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Pesquisador from "../pesquisador/PesquisadorDrawer";

interface CardPesquisadorProps {
    onClick?: () => void; // Adicione esta prop
    researcher: Researcher
   
}

export default function CardPesquisador ({ onClick, researcher }: CardPesquisadorProps) {
    const [openDrawer, setOpenDrawer] = useState(false);
    
    return(
        <>
            <div  onClick={onClick ?  onClick : () => setOpenDrawer(true)}
                className="relative border-2 h-[250px] w-[200px] rounded-md p-2
                        cursor-pointer overflow-hidden bg-black group
                ">
            
            <div className={`absolute inset-0 
                     bg-cover bg-center 
                    opacity-70 group-hover:opacity-45 transition-opacity duration-300
`}>
            <Image
                fill
                alt="Imagem do pesquisador"
                className="rounded-t-lg object-cover"
                src={researcher.image ? `${researcher.image}` : "https://picsum.photos/100/100"}/>
          </div>

            <div className="relative p-2 flex flex-col h-full justify-end gap-2">
                <div className="text-white">
                    <p className=" text-xl ">{researcher.name}</p>
                    <div className="hidden group-hover:block ">
                        <p>{researcher.sex}</p>
                        <p>{researcher.race}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2
                            bg-secondary text-white py-1 px-3 rounded-sm w-fit text-md ">
                    <Book  size={20}/>
                    <p className="mb-1">{researcher.type}</p>
                </div>
            </div>
            {openDrawer && <Pesquisador isOpen={openDrawer} researcherId={researcher.id}  onClose={() =>  setOpenDrawer(false)}/>}

        </div>
    </>
    );
}
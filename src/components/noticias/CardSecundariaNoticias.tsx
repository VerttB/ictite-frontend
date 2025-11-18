import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CardSecundariaNoticias () {
    return(
        <div className="flex flex-row gap-5 border rounded-sm cursor-pointer group">
            <div>
                <Image src={"https://picsum.photos/100/100"} alt={"Noticia"} width={100} height={100}
                    className="object-cover rounded-l-md h-full">
                </Image>
            </div>

            <div className="flex flex-col gap-1 ml-2 p-3">
                <div className="flex flex-row gap-2 items-center">
                    <span className="px-3 py-1 text-white text-xs font-bold uppercase tracking-wider bg-secondary rounded-full shadow-sm">Informação</span>
                    <p className="text-xs text-gray-500 pl-2 border-l">14/10/2025</p>
                </div>
                <p className="text-xl font-semibold">Título da Noticia</p>
                <div className="flex gap-2 text-primary items-center font-bold group-hover:underline">
                    Ver Notícia <ArrowRight size={20} />
                </div>
            </div>
        </div>
    )
}
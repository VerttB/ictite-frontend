import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";

export default function CardNoticias () {
    return(
        <div className="relative min-h-[350px] rounded-md overflow-hidden group cursor-pointer border border-gray-200">
            {/* |=======| IMAGEM |=======| */}
            <Image
                src={"https://picsum.photos/900/600"} alt={"Imagem de Fundo"} width={1000} height={800}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* |=======| GRADIENTE |=======| */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* |=======| NOTÍCIA |=======| */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white flex flex-col justify-end h-full">
                <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-secondary rounded-full shadow-sm">
                            Informação
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                            <div className="flex items-center gap-1"><Calendar size={14} /> 14/10/2025</div>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                        Título da Notícia
                    </h2>
                    
                    <p className="text-gray-200 text-lg mb-6 max-w-3xl line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quia commodi dolorum eaque pariatur mollitia nam ipsa modi voluptatum sint quam corporis rem in corrupti doloremque, maxime itaque veniam adipisci!
                    </p>
                    
                    <div className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-transparent group-hover:border-primary transition-all pb-1">
                        Ler notícia completa <ArrowRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    )
}
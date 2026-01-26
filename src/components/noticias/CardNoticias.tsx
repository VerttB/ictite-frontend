import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import { InstagramPost } from "@/core/domain/Instagram";

interface CardNoticiasProps {
    post: InstagramPost;
}

export default function CardNoticias({ post }: CardNoticiasProps) {

    // FORMATANDO DATA QUANDO ADICIONOU NO BANCO
    const dataFormatada = new Date(post.post_date).toLocaleDateString('pt-BR');

    return (
        <div className="relative min-h-[350px] h-full rounded-md overflow-hidden group cursor-pointer border border-gray-200">
            {/* IMAGEM */}
            <Image
                src={post.image_url || "https://picsum.photos/900/600"} 
                alt={post.title || "Notícia"} 
                width={1000} height={800}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* GRADIENTE */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white flex flex-col justify-end h-full">
                <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-secondary rounded-full">
                            {post.type || "Informação"}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Calendar size={14} /> {dataFormatada}
                        </div>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 line-clamp-2">
                        {post.title}
                    </h2>
                    
                    <p className="text-gray-200 text-sm md:text-base mb-6 max-w-3xl line-clamp-3 opacity-0 group-hover:opacity-100 transition-all duration-500 h-0 group-hover:h-auto">
                        {post.description}
                    </p>
                    
                    <a href={post.post_url} target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        Ler notícia completa <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </div>
    );
}
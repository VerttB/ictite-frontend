import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { InstagramPost } from "@/core/domain/Instagram";

interface CardSecundariaProps {
    post: InstagramPost;
    isSelected: boolean;
    onSelect: () => void;
}

export default function CardSecundariaNoticias({ post, isSelected, onSelect }: CardSecundariaProps) {
    
    const dataFormatada = new Date(post.post_date).toLocaleDateString('pt-BR');

    return (
        <div 
            onClick={onSelect}
            className={`flex flex-row gap-5 border rounded-sm cursor-pointer group transition-colors ${
                isSelected ? "border-primary bg-primary/5" : "hover:bg-gray-50"
            }`}
        >
            <div className="w-32 h-24 shrink-0">
                <Image 
                    src={post.image_url || "https://picsum.photos/100/100"} 
                    alt={post.title || "Noticia"} 
                    width={128} height={96}
                    className="object-cover rounded-l-md h-full w-full"
                />
            </div>

            <div className="flex flex-col gap-1 p-3 overflow-hidden">
                <div className="flex flex-row gap-2 items-center">
                    <span className="px-2 py-0.5 text-white text-[10px] font-bold uppercase bg-secondary rounded-full">
                        {post.type || "Info"}
                    </span>
                    <p className="text-[10px] text-gray-500 pl-2 border-l">{dataFormatada}</p>
                </div>
                <p className="text-sm font-semibold line-clamp-2">{post.title}</p>
                <div className="flex gap-1 text-primary items-center text-xs font-bold group-hover:underline">
                    Ver Detalhes <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
}
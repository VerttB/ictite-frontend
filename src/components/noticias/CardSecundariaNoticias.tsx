import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { InstagramPost } from "@/core/domain/Instagram";

interface CardSecundariaProps {
    post: InstagramPost;
    isSelected: boolean;
    onSelect: () => void;
}

export default function CardSecundariaNoticias({
    post,
    isSelected,
    onSelect,
}: CardSecundariaProps) {
    const dataFormatada = new Date(post.post_date).toLocaleDateString("pt-BR");

    return (
        <div
            onClick={onSelect}
            className={`group flex cursor-pointer flex-row gap-5 rounded-sm border transition-colors ${
                isSelected ? "border-primary bg-primary/5" : "hover:bg-gray-50"
            }`}>
            <div className="h-24 w-32 shrink-0">
                <Image
                    src={post.image_url!}
                    alt={post.title || "Noticia"}
                    width={128}
                    height={96}
                    className="h-full w-full rounded-l-md object-cover"
                />
            </div>

            <div className="flex flex-col gap-1 overflow-hidden p-3">
                <div className="flex flex-row items-center gap-2">
                    <span className="bg-secondary rounded-full px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        {post.type || "Info"}
                    </span>
                    <p className="border-l pl-2 text-[10px] text-gray-500">
                        {dataFormatada}
                    </p>
                </div>
                <p className="line-clamp-2 text-sm font-semibold">{post.title}</p>
                <div className="text-primary flex items-center gap-1 text-xs font-bold group-hover:underline">
                    <ArrowLeft size={14} /> Aumentar
                </div>
            </div>
        </div>
    );
}

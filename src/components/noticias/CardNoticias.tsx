import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import { InstagramPost } from "@/core/domain/Instagram";

interface CardNoticiasProps {
    post: InstagramPost;
}

export default function CardNoticias({ post }: CardNoticiasProps) {
    // FORMATANDO DATA QUANDO ADICIONOU NO BANCO
    const dataFormatada = new Date(post.post_date).toLocaleDateString("pt-BR");

    return (
        <div className="group relative h-full min-h-[350px] cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-gray-500">
            {/* IMAGEM */}
            <Image
                src={post.image_url || "https://picsum.photos/900/600"}
                alt={post.title || "Notícia"}
                width={1000}
                height={800}
                className="absolute inset-0 h-full w-full object-scale-down transition-transform duration-700 group-hover:scale-105"
            />

            {/* GRADIENTE */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 flex h-full w-full flex-col justify-end p-6 text-white md:p-10">
                <div className="translate-y-2 transform transition-all duration-500 group-hover:translate-y-0">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="bg-secondary rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                            {post.type || "Informação"}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Calendar size={14} /> {dataFormatada}
                        </div>
                    </div>

                    <h2 className="mb-4 line-clamp-2 text-2xl font-bold md:text-3xl lg:text-4xl">
                        {post.title}
                    </h2>

                    <p className="mb-6 line-clamp-3 h-0 max-w-3xl text-sm text-gray-200 opacity-0 transition-all duration-500 group-hover:h-auto group-hover:opacity-100 md:text-base">
                        {post.description}
                    </p>

                    <a
                        href={post.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-flex items-center gap-2 font-bold hover:underline">
                        Ler notícia completa <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </div>
    );
}

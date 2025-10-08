import { Article } from "@/core/interface/Pesquisador/Article";
import { Calendar } from "lucide-react";

export default function CardArtigo ({article}:{article: Article}) {
    return(
        <div className=" p-2 flex flex-col gap-4 border shadow-md
            border-l-lime-500 h-fit border-l-8 w-full rounded-md bg-background
            ">
            <h2 className="text-md hyphens-auto text-wrap">{article.title}</h2>
            <p className="text-sm text-font-primary text-justify max-h-28 overflow-y-auto line-clamp-1">{article.abstract}</p>
            <span className="flex items-center gap-2 text-sm text-font-secondary"><Calendar size={16}/>{article.year}</span>
        </div>
    );
}
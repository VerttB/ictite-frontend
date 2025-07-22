import { Article } from "@/core/interface/Pesquisador/Article";
import { Calendar } from "lucide-react";

export default function CardArtigo ({article}:{article: Article}) {
    return(
        <div className=" p-2 flex flex-col gap-4 border shadow-xl 
            border-l-lime-500 border-l-8 w-96 rounded-md bg-slate-50
            ">
            <h2 className="text-xl font-semibold line-clamp-2">{article.title}</h2>
            <p className="text-sm text-gray-500 text-justify max-h-28 overflow-y-auto line-clamp-1">{article.abstract}</p>
            <span className="flex items-center gap-2 text-sm text-gray-400"><Calendar size={16}/>{article.year}</span>
        </div>
    );
}
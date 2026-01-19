import { ResearcherArticles } from "@/core/domain/Researcher";
import { Calendar } from "lucide-react";

export default function CardArtigo({
    article,
}: {
    article: ResearcherArticles;
}) {
    return (
        <div className="bg-background flex h-fit w-full flex-col gap-4 rounded-md border border-l-8 border-l-lime-500 p-2 shadow-md">
            <h2 className="text-md text-wrap hyphens-auto">{article.title}</h2>
            <p className="text-font-primary line-clamp-1 max-h-28 overflow-y-auto text-justify text-sm">
                {article.abstract}
            </p>
            <span className="text-font-secondary flex items-center gap-2 text-sm">
                <Calendar size={16} />
                {article.year}
            </span>
        </div>
    );
}

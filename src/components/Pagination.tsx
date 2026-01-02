import { Button } from "./ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
interface PaginationProps {
    currentPage: number;
    onLoadMore: (page: number) => void;
    totalPages: number;
}

export const Pagination = ({ currentPage, onLoadMore, totalPages }: PaginationProps) => {
    const getPageNumbers = () => {
        const pages = new Set<number>();

        pages.add(1);

        if (currentPage > 1) pages.add(currentPage - 1);
        pages.add(currentPage);
        if (currentPage < totalPages) pages.add(currentPage + 1);
        if (totalPages > 1) pages.add(totalPages);

        if (currentPage > 2 && pages.size < 5) pages.add(currentPage - 2);
        if (currentPage < totalPages - 1 && pages.size < 5) pages.add(currentPage + 2);

        if (currentPage > 3 && pages.size < 5) pages.add(currentPage - 3);
        if (currentPage < totalPages - 2 && pages.size < 5) pages.add(currentPage + 3);

        return Array.from(pages)
            .sort((a, b) => a - b)
            .filter((p) => p <= totalPages);
    };

    const visiblePages = getPageNumbers();
    const isAtStart = currentPage <= 1;
    const isAtEnd = currentPage >= totalPages;
    const hasMoreData = currentPage < totalPages;
    if (totalPages === 0) return null;
    return (
        <div className="bg-background flex w-full items-center justify-center gap-3 rounded-lg py-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={isAtStart}
                onClick={() => onLoadMore(currentPage - 1)}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Anterior</span>
            </Button>

            <div className="flex gap-1">
                {visiblePages.map((page, index) => {
                    const previousPage = visiblePages[index - 1];
                    const showEllipsis = previousPage && page - previousPage > 1;

                    return (
                        <div key={page} className="flex items-center">
                            {showEllipsis && (
                                <span className="text-muted-foreground px-2 text-sm">
                                    ...
                                </span>
                            )}
                            <Button
                                onClick={() => onLoadMore(page)}
                                variant={currentPage === page ? "default" : "outline"}
                                className={`h-8 w-8 p-0 ${currentPage === page ? "pointer-events-none" : ""}`}
                                aria-current={currentPage === page ? "page" : undefined}>
                                {page}
                            </Button>
                        </div>
                    );
                })}
            </div>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={isAtEnd || (hasMoreData === false && currentPage >= totalPages)}
                onClick={() => onLoadMore(currentPage + 1)}>
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Próximo</span>
            </Button>
        </div>
    );
};

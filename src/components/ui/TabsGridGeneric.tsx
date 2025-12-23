import { useViewPort } from "@/hooks/useViewPort";
import { Spinner } from "../LoadingSpin";
import Masonry from "react-responsive-masonry";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ScrollArea";

type TabsGridProps<T> = {
    isLoading: boolean;
    isError: boolean;
    emptyMessage?: string;
    data?: T[] | null | undefined;
    renderItem?: (item: T) => React.ReactNode;
    children?: React.ReactNode;
    layoutType?: "grid" | "list" | "masonry";
    minCardWidth?: string;
    masonryGutter?: string;
    className?: string;
};

export const TabsGrid = <T,>({
    isLoading,
    isError,
    data,
    renderItem,
    className,
    emptyMessage = "Nenhum item encontrado.",
    minCardWidth = "260px",
    layoutType = "grid",
    masonryGutter = "10px",
    children = null,
}: TabsGridProps<T>) => {
    const { isMobile, isTablet } = useViewPort();
    if (children) return <>{children}</>;

    if (isLoading) {
        return <Spinner />;
    }
    if (isError) {
        return <div>Erro ao carregar os dados.</div>;
    }
    if (!data || data.length === 0 || renderItem === undefined || Array.isArray(data) === false) {
        return <div>{emptyMessage}</div>;
    }
    

    if (layoutType === "grid") {
        return (
            <div
                className={cn("mt-4 grid w-full gap-4", className)}
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))`,
                }}>
                { data.map((item) => renderItem(item))}
            </div>
        );
    }

    if (layoutType === "list") {
        return (
            <div className={cn("mt-4 flex w-full flex-col gap-4", className)}>
                {data.map((item) => renderItem(item))}
            </div>
        );
    }

    if (layoutType === "masonry") {
        const columnsCount = isMobile ? 1 : isTablet ? 2 : 3;
        return (
            <div className={cn("mt-4 w-full", className)}>
                <Masonry columnsCount={columnsCount} gutter={masonryGutter}>
                    {data.map((item) => renderItem(item))}
                </Masonry>
            </div>
        );
    }
};

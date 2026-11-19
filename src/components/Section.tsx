import { Image } from "@/core/domain/Image";
import { CardGenerico } from "./card/CardGenerico";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Grid, List } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
interface BaseItem {
    id: string;
    name: string;
    images?: Image[];
    image?: string | null;
}

interface SectionProps<T extends BaseItem> {
    title: string;
    items: T[];
    total?: number;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    onAdd?: () => void;
    onUpdate?: (item: T) => void;
    onDelete?: (item: T) => void;
    tooltipText?: (item: T) => string | undefined;
    fallbackImage?: string;
}

const resolveImage = (item: BaseItem) => {
    if (item.image) return item.image;

    if (typeof item.images === "string") return item.images;

    if (Array.isArray(item.images) && item.images.length > 0) {
        return item.images[0].url;
    }

    return undefined;
};

export const Section = <T extends BaseItem>({
    title,
    items,
    total,
    icon,
    onAdd,
    onUpdate,
    onDelete,
    children,
    tooltipText,
    fallbackImage,
}: SectionProps<T>) => {
    const [layout, setLayout] = useState<"grid" | "list">("grid");
    return (
        <section className="min-w-0 flex-1 px-2 sm:px-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-border pb-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {icon}
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <p className="bg-primary w-18 rounded-md py-2 text-center text-sm text-white">
                        Total: {total ?? items.length}
                    </p>
                </div>
                <div className="order-last w-full min-w-0 lg:order-none lg:ml-4 lg:w-auto lg:flex-1">{children}</div>
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant={"ghost"}
                        onClick={() => setLayout("list")}
                        className="px-0.5 py-0 text-font-primary hover:bg-accent"
                        aria-label="Layout em lista"
                        aria-pressed={layout === "list"}
                        title="Layout em lista">
                        <List
                            size={20}
                            className={layout === "list" ? "text-font-primary" : ""}
                        />
                    </Button>
                    <Button
                        variant={"ghost"}
                        onClick={() => setLayout("grid")}
                        className="px-0.5 py-0 text-font-primary hover:bg-accent"
                        aria-label="Layout em grade"
                        aria-pressed={layout === "grid"}
                        title="Layout em grade">
                        <Grid size={20} />
                    </Button>
                </div>
            </div>
            <div
                className={
                    layout === "grid"
                        ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
                        : "flex flex-col gap-2"
                }>
                <TooltipProvider>
                    {items.map((item, i) => {
                        const cardElement = (
                            <CardGenerico
                                title={item.name}
                                image={resolveImage(item)}
                                fallbackImage={fallbackImage}
                            />
                        );

                        return (
                            <DropdownMenu key={item.name + i}>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex justify-center cursor-pointer w-full">
                                        {tooltipText && tooltipText(item) ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="w-full flex justify-center">
                                                        {cardElement}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {tooltipText(item)}
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            cardElement
                                        )}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" sideOffset={4}>
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="my-1 h-px bg-slate-200" />
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setTimeout(() => {
                                                if (onUpdate) onUpdate(item);
                                            }, 100);
                                        }}>
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                                        onClick={() => {
                                            setTimeout(() => {
                                                if (onDelete) onDelete(item);
                                            }, 100);
                                        }}>
                                        Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        );
                    })}
                </TooltipProvider>
                {onAdd && (
                    <div className="flex justify-center">
                        <CardGenerico isAddButton onClick={onAdd} />
                    </div>
                )}
            </div>
        </section>
    );
};

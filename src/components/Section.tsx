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
import { set } from "zod";
interface BaseItem {
    id: string;
    name: string;
    images?: Image[];
    image?: string;
}

interface SectionProps<T extends BaseItem> {
    title: string;
    items: T[];
    icon?: React.ReactNode;
    children?: React.ReactNode;
    onAdd?: () => void;
    onUpdate?: (item: T) => void;
    onDelete?: (item: T) => void;
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
    icon,
    onAdd,
    onUpdate,
    onDelete,
    children,
}: SectionProps<T>) => {
    const [layout, setLayout] = useState<"grid" | "list">("grid");
    return (
        <section className="flex-1 px-4">
            <div className="mb-4 flex items-center justify-between border-b-2 border-gray-300">
                <div className="flex items-center">
                    {icon}
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <p className="bg-primary ml-4 rounded-md px-1 py-0.5 text-sm text-white">
                        Total: {items.length}
                    </p>
                </div>
                <div className="ml-4 h-12 w-full">{children}</div>
                <div className="mb-2 ml-auto flex items-center gap-2">
                    <Button
                        variant={"ghost"}
                        onClick={() => setLayout("list")}
                        className="px-0.5 py-0 hover:bg-gray-200"
                        title="Layout em lista">
                        <List
                            size={20}
                            className={layout === "list" ? "text-font-primary" : ""}
                        />
                    </Button>
                    <Button
                        variant={"ghost"}
                        onClick={() => setLayout("grid")}
                        className="px-0.5 py-0 hover:bg-gray-200"
                        title="Layout em grade">
                        <Grid size={20} color="black" className="" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {items.map((item, i) => (
                    <DropdownMenu key={item.name + i}>
                        <DropdownMenuTrigger>
                            <CardGenerico title={item.name} image={resolveImage(item)} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" sideOffset={4}>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setTimeout(() => {
                                        if (onUpdate) onUpdate(item);
                                    }, 100);
                                }}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setTimeout(() => {
                                        if (onDelete) onDelete(item);
                                    }, 100);
                                }}>
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ))}
                {onAdd && <CardGenerico isAddButton onClick={onAdd} />}
            </div>
        </section>
    );
};

import { Image } from "@/core/domain/Image";
import { CardGenerico } from "./card/CardGenerico";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";

type ItemType = {
    name: string;
    images?: Image[];
    image?: string;
};

type SectionProps = {
    title: string;
    items: ItemType[];
    icon?: React.ReactNode;
    onAdd?: () => void;
    onUpdate?: (item: any) => void;
    onDelete?: (item: any) => void;
};

const resolveImage = (item: ItemType) => {
    if (item.image) return item.image;

    if (typeof item.images === "string") return item.images;

    if (Array.isArray(item.images) && item.images.length > 0) {
        return item.images[0].url;
    }

    return undefined;
};

export const Section = ({ title, items, icon, onAdd }: SectionProps) => {
    console.log(items);
    return (
        <section className="mb-10">
            <div className="mb-4 flex h-8 items-center border-b-2 border-gray-300">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <p className="bg-primary ml-4 rounded-md px-1 py-0.5 text-sm text-white">
                    Total: {items.length}
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {items.map((item, i) => (
                    <DropdownMenu key={item.name + i}>
                        <DropdownMenuTrigger>
                            <CardGenerico
                                title={item.name}
                                image={resolveImage(item)}
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" sideOffset={4}>
                            <DropdownMenuLabel>Opções</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ))}
                <CardGenerico isAddButton onClick={onAdd} />
            </div>
        </section>
    );
};

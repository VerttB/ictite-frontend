"use client";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
type CardProps = {
    title?: string;
    image?: string;
    onClick?: () => void;
    isAddButton?: boolean;
};

export const CardGenerico = ({
    title,
    image,
    onClick,
    isAddButton,
}: CardProps) => {
    if (isAddButton) {
        return (
            <Button
                onClick={onClick}
                className="flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200">
                <Plus className="text-primary size-16 font-light" />
            </Button>
        );
    }

    return (
        <div
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            className="group relative h-40 w-40 cursor-pointer overflow-hidden rounded-md shadow-xs">
            {image && (
                <Image
                    src={image}
                    alt={title ?? "Card"}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
            )}
            {title && (
                <div
                    title={title}
                    className="bg-background/70 text-font-primary absolute right-0 bottom-0 left-0 line-clamp-2 flex h-10 items-center justify-center py-2 text-center text-xs text-ellipsis">
                    {title}
                </div>
            )}
        </div>
    );
};

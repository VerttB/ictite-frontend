"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { getAssetPrefix } from "@/core/utils/api";
type CardProps = {
    title?: string;
    image?: string;
    onClick?: () => void;
    isAddButton?: boolean;
    fallbackImage?: string;
};

export const CardGenerico = ({
    title,
    image,
    onClick,
    isAddButton,
    fallbackImage,
}: CardProps) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(image);

    useEffect(() => {
        setImgSrc(image);
    }, [image]);

    if (isAddButton) {
        return (
            <Button
                onClick={onClick}
                className="flex h-40 w-full max-w-40 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200">
                <Plus className="text-primary size-16 font-light" />
            </Button>
        );
    }

    return (
        <div
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            className="group relative h-40 w-full max-w-40 cursor-pointer overflow-hidden rounded-md shadow-xs">
            {imgSrc ? (
                <Image
                    src={imgSrc}
                    alt={title ?? "Card"}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    onError={() => setImgSrc(fallbackImage || "")}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                    <Image
                        src={`${getAssetPrefix()}/logoImagem.png`}
                        alt="Default logo"
                        width={64}
                        height={64}
                        className="opacity-40"
                    />
                </div>
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

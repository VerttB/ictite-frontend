"use client";
import { getAssetPrefix } from "@/core/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const ImageDisplay = ({
    src,
    alt,
    className,
    fallbackImage,
}: {
    src?: string;
    alt: string;
    className?: string;
    fallbackImage?: string;
}) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(src || fallbackImage);

    useEffect(() => {
        setImgSrc(src || fallbackImage);
    }, [src, fallbackImage]);

    if (!src && !fallbackImage) {
        return (
            <div className="flex h-72 w-92 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 text-gray-500">
                Sem imagem disponível
            </div>
        );
    }

    return (
        <div
            className={twMerge(
                "relative h-72 w-92 rounded-lg max-md:size-32",
                className
            )}>
            <Image
                src={imgSrc || `${getAssetPrefix()}/logoImagem.png`}
                alt={alt}
                fill
                className="rounded-lg border-white/60 object-scale-down p-2 shadow-xs"
                onError={() => {
                    if (imgSrc !== fallbackImage && fallbackImage) {
                        setImgSrc(fallbackImage);
                    } else if (imgSrc !== `${getAssetPrefix()}/logoImagem.png`) {
                        setImgSrc(`${getAssetPrefix()}/logoImagem.png`);
                    }
                }}
            />
        </div>
    );
};

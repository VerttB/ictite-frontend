import Image from "next/image";
import { twMerge } from "tailwind-merge";

export const ImageDisplay = ({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
}) => {
    if (!src) {
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
                src={src}
                alt={alt}
                fill
                className="rounded-lg border-white/60 object-scale-down p-2 shadow-xs"
            />
        </div>
    );
};

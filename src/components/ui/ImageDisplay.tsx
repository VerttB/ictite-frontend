import Image from "next/image";

export const ImageDisplay = ({ src, alt }: { src: string; alt: string }) => {
    return (
        <div className="relative flex min-h-64 max-w-76 justify-center rounded-lg sm:w-3/5">
            <Image
                fill
                src={src}
                alt={alt}
                className="object-fit rounded-lg border-3 border-white/60 p-2 shadow-xs"
            />
        </div>
    );
};

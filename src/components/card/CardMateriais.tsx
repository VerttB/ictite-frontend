import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

interface MateriaisProps {
    name: string;
    description: string;
    type: string;
    link: string;
    images: string[];
}

interface CardMateriaisProps {
    material: MateriaisProps;
}

export default function CardMateriais({ material }: CardMateriaisProps) {
    return (
        <Link href={material.link as Route} target="_blank">
            <div className="group bg-secondary flex h-[320px] w-[240px] cursor-pointer flex-col overflow-hidden rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md md:w-[260px]">
                <div className="relative h-[140px] w-full">
                    <Image
                        src={material.images[0] || "https://picsum.photos/400/300"}
                        alt={material.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"></Image>
                    <span className="bg-primary absolute top-2 right-2 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-sm">
                        {material.type}
                    </span>
                </div>

                {/* Conteúdo */}
                <div className="flex flex-1 flex-col gap-2 p-3 text-white">
                    <h2 className="line-clamp-2 text-lg leading-tight font-semibold">
                        {material.name}
                    </h2>
                    <p className="line-clamp-4 text-justify text-sm text-white/90">
                        {material.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}

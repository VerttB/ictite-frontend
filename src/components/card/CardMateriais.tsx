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
        <Link href={material.link} target="_blank">
            <div className="group bg-secondary w-[240px] md:w-[260px] h-[320px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col">
                <div className="relative w-full h-[140px]">
                    <Image
                        src={material.images[0] || "https://picsum.photos/400/300"}
                        alt={material.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"></Image>
                    <span className="absolute top-2 right-2 bg-primary text-xs text-white font-semibold px-2 py-1 rounded-md shadow-sm">
                        {material.type}
                    </span>
                </div>

                {/* Conteúdo */}
                <div className="flex flex-col flex-1 gap-2 p-3 text-white">
                    <h2 className="text-lg font-semibold leading-tight line-clamp-2">
                        {material.name}
                    </h2>
                    <p className="text-sm text-white/90 line-clamp-4 text-justify">
                        {material.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}

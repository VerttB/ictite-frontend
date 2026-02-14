import { Map, MapPin } from "lucide-react";
import Image from "next/image";
import { School } from "@/core/domain/School";
import Link from "next/link";
import { ImageDisplay } from "../ui/ImageDisplay";

interface EscolaCardProps {
    escola: School;
}

export default function EscolaCard({ escola }: EscolaCardProps) {
    return (
        <Link href={`/escolas/${escola.id}`}>
            <div className="flex w-full cursor-pointer flex-col gap-1 rounded-md border transition-all hover:scale-[102%] hover:shadow-md">
                {/* |=======| IMAGEM DA ESCOLA |=======| */}
                <ImageDisplay
                    src={escola.images[0]?.url}
                    alt={`Imagem da escola ${escola.name}`}
                    className=""
                />
                <div className="bg-primary absolute top-2 left-2 rounded-md px-2 py-1 shadow-sm">
                    <div className="flex items-center gap-1 text-xs text-white">
                        <MapPin size={14} />
                        <span>{escola.city}</span>
                    </div>
                </div>
            </div>
            {/* |=======| INFORMAÇÕES DA ESCOLA |=======| */}
            <div className="flex flex-col gap-1 p-3">
                <h1 className="line-clamp-1 text-lg font-semibold" title={escola.name}>
                    {escola.name}
                </h1>
                <div className="text-primary flex items-center gap-2 text-sm">
                    <Map size={16} />
                    <span className="line-clamp-1">
                        {escola.identityTerritory?.name || "Território não definido"}
                    </span>
                </div>
            </div>
        </Link>
    );
}

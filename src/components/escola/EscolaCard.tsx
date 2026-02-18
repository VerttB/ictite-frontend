import { Map, MapPin } from "lucide-react";
import { School } from "@/core/domain/School";
import Link from "next/link";
import { ImageDisplay } from "../ui/ImageDisplay";
import Image from "next/image";

interface EscolaCardProps {
    escola: School;
}

export default function EscolaCard({ escola }: EscolaCardProps) {
    return (
        <Link className="group block h-full" href={`/escolas/${escola.id}`}>
            <div className="relative flex w-full cursor-pointer flex-col gap-1 overflow-hidden rounded-md border transition-all hover:scale-[102%] hover:shadow-md">
                {/* |=======| IMAGEM DA ESCOLA |=======| */}
                <div className="relative aspect-video w-full bg-slate-100">
                    {escola.images && escola.images.length > 0 ? (
                        <Image
                            src={escola.images[0].url}
                            alt={`Imagem da escola ${escola.name}`}
                            fill
                            className="object-scale-down p-2"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                            Sem imagem
                        </div>
                    )}
                </div>
                <div className="bg-primary absolute top-2 left-2 rounded-md px-2 py-1 shadow-sm">
                    <div className="flex items-center gap-1 text-xs text-white">
                        <MapPin size={14} />
                        <span>{escola.city}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1 p-3">
                    <h1
                        className="line-clamp-1 text-lg font-semibold"
                        title={escola.name}>
                        {escola.name}
                    </h1>
                    <div className="text-primary flex items-center gap-2 text-sm">
                        <Map size={16} />
                        <span className="line-clamp-1">
                            {escola.identityTerritory?.name || "Território não definido"}
                        </span>
                    </div>
                </div>
            </div>
            {/* |=======| INFORMAÇÕES DA ESCOLA |=======| */}
        </Link>
    );
}

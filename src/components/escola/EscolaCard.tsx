import { Map, MapPin } from "lucide-react";
import Image from "next/image";
import { School } from "@/core/domain/School";

interface EscolaCardProps {
    escola: School;
}

export default function EscolaCard({ escola }: EscolaCardProps) {

    return (
        <div className="flex flex-col gap-1 w-full sm:w-[300px] border rounded-md transition-all hover:scale-[102%] hover:shadow-md cursor-pointer bg-white">
            {/* |=======| IMAGEM DA ESCOLA |=======| */}
            <div className="relative h-[200px] w-full overflow-hidden rounded-t-md">
                <Image
                    src={escola.images && escola.images.length > 0 
                        ? escola.images[0].url 
                        : "https://picsum.photos/300/190"}
                    alt={escola.name}
                    fill
                    className="rounded-t-md object-cover"
                />

                <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded-md shadow-sm">
                    <div className="flex text-white text-xs items-center gap-1">
                        <MapPin size={14}/>
                        <span>{escola.city}</span>
                    </div>
                </div>
            </div>

            {/* |=======| INFORMAÇÕES DA ESCOLA |=======| */}
            <div className="flex flex-col p-3 gap-1">
                <h1 className="line-clamp-1 text-lg font-semibold text-slate-800" title={escola.name}>
                    {escola.name}
                </h1>
                <div className="flex gap-2 text-sm items-center text-primary/80">
                    <Map size={16} />
                    <span className="line-clamp-1">Território Identidade</span>
                </div>
            </div>
        </div>
    );
}
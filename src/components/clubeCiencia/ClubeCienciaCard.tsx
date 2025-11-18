import { ClubeCiencia } from "@/core/interface/Clube/ClubeCiencia";
import { School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ClubeCienciaCardProps {
    clubeCiencia: ClubeCiencia;
}

export default function ClubeCienciaCard ( { clubeCiencia }: ClubeCienciaCardProps ) {
    return(
        <Link href={`/clubes/${clubeCiencia.id}`}>
            <div className="flex flex-col gap-1 rounded-md border w-[300px] hover:shadow-md hover:scale-[102%] transition-all cursor-pointer">
                <div>
                    <Image src={ clubeCiencia.images.length > 0 ? clubeCiencia.images[0].path : "https://picsum.photos/300/190"} alt={"Clube Ciência"} width={300} height={200}
                    className="object-cover rounded-t-md"></Image>
                </div>
                <div className="p-3">
                    <h1 className="text-xl font-semibold line-clamp-1">{clubeCiencia.title}</h1>
                    <div className=" flex gap-2 items-center text-primary ">
                        <School  size={20}/>
                        <p className="line-clamp-1">{clubeCiencia.school}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
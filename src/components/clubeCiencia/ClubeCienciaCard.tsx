import { ScienceClub } from "@/core/domain/Club";
import { School } from "lucide-react";
import Link from "next/link";
import { ImageDisplay } from "../ui/ImageDisplay";

interface ClubeCienciaCardProps {
    clubeCiencia: ScienceClub;
}

export default function ClubeCienciaCard({ clubeCiencia }: ClubeCienciaCardProps) {
    return (
        <Link href={`/clubes/${clubeCiencia.id}`}>
            <div className="flex w-[300px] cursor-pointer flex-col gap-1 rounded-md border transition-all hover:scale-[102%] hover:shadow-md">
                <ImageDisplay
                    src={clubeCiencia.images[0].url}
                    alt="Imagem do clube de ciencias"
                    className="size-72"
                />

                <div className="p-3">
                    <h1 className="line-clamp-1 text-xl font-semibold">
                        {clubeCiencia.name}
                    </h1>
                    <div className="text-primary flex items-center gap-2">
                        <School size={20} />
                        <p className="line-clamp-1">{clubeCiencia.school.name}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

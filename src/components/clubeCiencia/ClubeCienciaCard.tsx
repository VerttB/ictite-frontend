import { ScienceClub } from "@/core/domain/Club";
import { School } from "lucide-react";
import Link from "next/link";
import { ImageDisplay } from "../ui/ImageDisplay";
import Image from "next/image";

interface ClubeCienciaCardProps {
    clubeCiencia: ScienceClub;
}

export default function ClubeCienciaCard({ clubeCiencia }: ClubeCienciaCardProps) {
    return (
        <Link href={`/clubes/${clubeCiencia.id}`}>
            <div className="relative flex w-full cursor-pointer flex-col gap-1 overflow-hidden rounded-md border transition-all hover:scale-[102%] hover:shadow-md">
                <div className="relative aspect-video w-full bg-slate-100">
                    {clubeCiencia.images && clubeCiencia.images.length > 0 ? (
                        <Image
                            src={clubeCiencia.images[0].url}
                            alt={`Imagem do clube de ciências ${clubeCiencia.name}`}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                            Sem imagem
                        </div>
                    )}
                </div>

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

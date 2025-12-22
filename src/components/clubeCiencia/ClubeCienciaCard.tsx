import { ScienceClub } from "@/core/domain/Club";
import { School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ClubeCienciaCardProps {
    clubeCiencia: ScienceClub;
}

export default function ClubeCienciaCard({
    clubeCiencia,
}: ClubeCienciaCardProps) {
    return (
        <Link href={`/clubes/${clubeCiencia.id}`}>
            <div className="flex w-[300px] cursor-pointer flex-col gap-1 rounded-md border transition-all hover:scale-[102%] hover:shadow-md">
                <div className="relative h-[200px] w-full overflow-hidden rounded-t-md">
                    <Image
                        src={
                            clubeCiencia.images.length > 0
                                ? clubeCiencia.images[0].url
                                : "https://picsum.photos/300/190"
                        }
                        alt={"Clube Ciência"}
                        fill
                        className="rounded-t-md object-cover"></Image>
                </div>
                <div className="p-3">
                    <h1 className="line-clamp-1 text-xl font-semibold">
                        {clubeCiencia.name}
                    </h1>
                    <div className="text-primary flex items-center gap-2">
                        <School size={20} />
                        <p className="line-clamp-1">
                            {clubeCiencia.school.name}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

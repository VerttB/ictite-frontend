"use client";
import { Researcher } from "@/core/domain/Researcher";
import { Book } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Pesquisador from "./PesquisadorDrawer";
import Link from "next/link";

interface CardPesquisadorProps {
    onClick?: () => void;
    researcher: Researcher;
}

export default function CardPesquisador({ researcher }: CardPesquisadorProps) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const defaultImage = `${process.env.NEXT_PUBLIC_BASE_URL}/images/DefaultResearcherImage.jpg`;
    const image = researcher.image || defaultImage;
    const [failedImage, setFailedImage] = useState<string | null>(null);
    const imgSrc = failedImage === image ? defaultImage : image;

    const card = (
        <div
            className={`group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-md border-2 bg-black p-2 ${researcher.lattes_id ? "cursor-pointer" : ""}`}>
            <div
                className={`absolute inset-0 bg-cover bg-center opacity-70 transition-opacity duration-300 group-hover:opacity-45`}>
                <Image
                    fill
                    alt="Imagem do pesquisador"
                    className="rounded-t-lg object-cover"
                    src={imgSrc}
                    onError={() => {
                        if (imgSrc !== defaultImage) setFailedImage(image);
                    }}
                />
            </div>

            <div className="relative flex h-full flex-col justify-end gap-2 p-2">
                <div className="text-white">
                    <p className="text-xl">{researcher.name}</p>
                    <div className="hidden group-hover:block">
                        <p>{researcher.gender}</p>
                        <p>{researcher.race}</p>
                    </div>
                </div>
                <div className="bg-secondary text-md flex w-fit items-center justify-center gap-2 rounded-sm px-3 py-1 text-white">
                    <Book size={20} />
                    <p className="mb-1">{researcher.type}</p>
                </div>
            </div>
            {openDrawer && (
                <Pesquisador
                    isOpen={openDrawer}
                    researcherId={researcher.id}
                    onClose={() => setOpenDrawer(false)}
                />
            )}
        </div>
    );

    return researcher.lattes_id ? (
        <Link
            href={`https://simcc.uesc.br/researcher?lattes_id=${researcher.lattes_id}`}
            target="_blank">
            {card}
        </Link>
    ) : (
        card
    );
}

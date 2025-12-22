"use client";
import { Researcher } from "@/core/domain/Researcher";
import { Book } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Pesquisador from "./PesquisadorDrawer";

interface CardPesquisadorProps {
    onClick?: () => void;
    researcher: Researcher;
}

export default function CardPesquisador({
    onClick,
    researcher,
}: CardPesquisadorProps) {
    const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <>
            <div
                className="group relative flex h-full min-h-[300px] cursor-pointer flex-col overflow-hidden rounded-md border-2 bg-black p-2"
                onClick={onClick ? onClick : () => setOpenDrawer(true)}>
                <div
                    className={`absolute inset-0 bg-cover bg-center opacity-70 transition-opacity duration-300 group-hover:opacity-45`}>
                    <Image
                        fill
                        alt="Imagem do pesquisador"
                        className="rounded-t-lg object-cover"
                        src={
                            researcher.image
                                ? `${researcher.image}`
                                : "https://picsum.photos/100/100"
                        }
                    />
                </div>

                <div className="relative flex h-full flex-col justify-end gap-2 p-2">
                    <div className="text-white">
                        <p className="text-xl">{researcher.name}</p>
                        <div className="hidden group-hover:block">
                            <p>{researcher.sex}</p>
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
        </>
    );
}

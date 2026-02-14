import React from "react";
import { PesquisadorTabs } from "@/components/pesquisador/PesquisadorTabs";
import { getResearcherById } from "@/core/service/PesquisadorService";
import { GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";

import { ScrollArea } from "@/components/ScrollArea";
import { Downloader } from "@/components/Downloader";
import { ImageDisplay } from "@/components/ui/ImageDisplay";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const researcher = await getResearcherById(id);

    if (!researcher) {
        return (
            <div className="flex w-full flex-col gap-4 overflow-x-hidden p-4">
                <h2 className="text-2xl font-semibold">Pesquisador não encontrado</h2>
            </div>
        );
    }
    return (
        <div className="flex w-full flex-col gap-4 overflow-x-hidden p-4">
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <ImageDisplay src={researcher.image!} alt="Imagem do pesquisador" />

                <div className="w-full">
                    <div className="mb-2 flex items-start justify-between gap-2 sm:items-center">
                        <h1 className="text-3xl">{researcher.name}</h1>
                        <Downloader path="researchers" id={researcher.id} />
                    </div>
                    {researcher.simcc && (
                        <div className="flex w-full flex-col gap-4">
                            <div className="flex w-full flex-wrap justify-between gap-4 sm:justify-normal">
                                <span className="text-font-primary/80 flex items-center gap-1 text-xs lg:text-lg">
                                    <MapPin size={15} />
                                    <p>
                                        {researcher?.simcc.city ??
                                            "Cidade não disponível"}
                                    </p>
                                </span>
                                <span className="text-font-primary/80 flex items-center gap-1 text-xs lg:text-lg">
                                    <GraduationCap size={15} />
                                    <p>
                                        {researcher?.simcc.graduation ??
                                            "Graduação não disponível"}
                                    </p>
                                </span>
                            </div>
                            <div className="text-justify text-gray-500">
                                <ScrollArea className="md:h-52">
                                    {researcher.simcc?.abstract ??
                                        "Descrição não disponível."}
                                </ScrollArea>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <PesquisadorTabs researcher={researcher} />
        </div>
    );
}

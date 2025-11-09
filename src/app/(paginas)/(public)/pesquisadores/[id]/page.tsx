import React from "react";
import { PesquisadorTabs } from "@/components/pesquisador/PesquisadorTabs";
import { getResearcherById } from "@/core/service/PesquisadorService";
import { GraduationCap, MapPin, School} from "lucide-react";
import Image from "next/image";

import { ScrollArea } from "@/components/ScrollArea";
import { Downloader } from "@/components/Downloader";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;

}) {

  const { id } = await params;
  const researcher = await getResearcherById(id, true);

  if (!researcher) {
    return (
      <div className="w-full flex flex-col gap-4 overflow-x-hidden p-4 ">
        <h2 className="text-2xl font-semibold">Pesquisador não encontrado</h2>
      </div>
    );
  }

  return(
      <div className="w-full flex flex-col gap-4 overflow-x-hidden p-4 ">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="w-full sm:w-1/2 xl:w-2/7 h-72  relative cursor-pointer">
            <Image
              fill
              src={researcher.image ? `${researcher.image}` : "https://picsum.photos/100/100"}
              alt="pesquisador"
              className="rounded-md border border-border object-cover"
            />
          </div>
          <div className="w-full ">
            <div className="flex justify-between items-start sm:items-center gap-2 mb-2">
              <h1 className="text-3xl">{researcher.name}</h1>
              <Downloader path="researchers" id={researcher.id}/>
            </div>
            {researcher.simcc && (
              <div className="flex flex-col gap-4 w-full">
               <div className="flex flex-wrap justify-between sm:justify-normal gap-4 w-full">
                <span className="flex items-center gap-1 text-xs lg:text-lg text-font-primary/80">
                  <MapPin size={15} />
                  <p>{researcher?.simcc.city ?? "Cidade não disponível"}</p>
                </span>
                <span className="flex items-center gap-1 text-xs lg:text-lg text-font-primary/80">
                  <GraduationCap size={15} />
                  <p>{researcher?.simcc.graduation ?? "Graduação não disponível"}</p>
                </span>
                <span className="flex items-center gap-1 text-xs lg:text-lg text-font-primary/80">
                  <School size={15} />
                  <p>{researcher?.school ?? "Instituição não disponível"}</p>
                </span>
                </div>
                <div className="text-justify text-gray-500 ">
                    <ScrollArea className="md:h-52">
                      {researcher.simcc?.abstract ?? "Descrição não disponível."}
                    </ScrollArea>
                </div>
                </div>
            )}
          </div>
        </div>
        <PesquisadorTabs researcher={researcher}/>
      </div>
  )
}
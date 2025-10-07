'use client'

import React from "react";
import useSWR from "swr";
import { PesquisadorTabs } from "@/components/pesquisador/PesquisadorTabs";
import { getResearcherById } from "@/core/service/PesquisadorService";
import { GraduationCap, MapPin, School} from "lucide-react";
import Image from "next/image";
import { Spinner } from "@/components/LoadingSpin";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ScrollArea";

export default function Page(){

  const { id } = useParams<{ id: string }>();
  const { data: researcher, error } = useSWR(id ? ["researcher", id] : null, () => getResearcherById(id, true))

  if (!id) return <div className="px-10 py-6">ID inválido</div>
  if (!researcher && !error) return (
    <div className="px-10 py-6"><Spinner size="large">Carregando...</Spinner></div>
  )
  if (error) return <div className="px-10 py-6 text-red-600">{(error as Error)?.message || 'Erro desconhecido'}</div>
  if (!researcher) return <div className="px-10 py-6">Pesquisador não encontrado</div>

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
            <h1 className="text-3xl">{researcher.name}</h1>
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
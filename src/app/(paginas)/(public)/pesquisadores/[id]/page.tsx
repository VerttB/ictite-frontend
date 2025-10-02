'use client'

import React from "react";
import useSWR from "swr";
import { PesquisadorTabs } from "@/components/pesquisador/PesquisadorTabs";
import { getResearcherById } from "@/core/service/PesquisadorService";
import { GraduationCap, MapPin} from "lucide-react";
import Image from "next/image";
import { Spinner } from "@/components/LoadingSpin";
import { useParams } from "next/navigation";

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
      <div className="w-full flex flex-col gap-4  p-8 ">
        <div className="flex  gap-4 justify-center">
          <div className="flex  w-1/4 min-h-64 h-full justify-center rounded-lg relative">
            <Image
              fill
              src={researcher.image ? `${researcher.image}` : "https://picsum.photos/100/100"}
              alt="pesquisador"
              className="rounded-md border border-border"
            />
          </div>
          <div className="items-center w-full ">
            <h1 className="text-3xl">{researcher.name}</h1>
            {researcher.simcc && (
              <>
                <p className="text-xl flex gap-2"><GraduationCap size={24} />{researcher.simcc.graduation}</p>
                <p className="text-xl flex gap-2"><MapPin size={24}/> {researcher.simcc.city}</p>
                <div className="text-justify text-gray-500 ">
                  <p className="text-sm ">
                    {researcher.simcc?.abstract ?? "Descrição não disponível."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <PesquisadorTabs researcher={researcher}/>
      </div>
  )
}
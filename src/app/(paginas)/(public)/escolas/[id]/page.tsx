"use client"

import React from "react";
import useSWR from "swr";
import { getSchoolById, getSchoolStatistics } from "@/core/service/SchoolService"
import Image from "next/image"
import { EscolaTabs } from "@/components/escola/EscolaTabs"
import { useParams } from "next/navigation";
import InfoBar from "@/components/InfoBar";
import { Book, LucideIcon, MapPin, Table, Table2 } from "lucide-react";

export default function Page(){
  const { id } = useParams<{ id: string }>();
  const { data: school, error: schoolError } = useSWR(id ? ["school", id] : null, () => getSchoolById(id))
  const { data: schoolStatistics, error: statsError } = useSWR(id ? ["schoolStatistics", id] : null, () => getSchoolStatistics(id))

  const loading = (!school && !schoolError) || (!schoolStatistics && !statsError)
  const error = schoolError || statsError
  let stats: { titulo: string; valor: number; Icon: LucideIcon }[] = []
  if(schoolStatistics)
    stats =[{
      titulo: "Pesquisadores", valor: schoolStatistics.researchers, Icon: Book
    },{
      titulo: "Projetos", valor: schoolStatistics.projects, Icon: Table2
    },{
      titulo: "Equipamentos", valor: schoolStatistics.equipments, Icon: Table
    }]
  if (loading) return (
    <div className="px-10 py-6">Carregando...</div>
  )

  if (error) return (
    <div className="px-10 py-6 text-red-600">{(error as Error).message || 'Erro desconhecido'}</div>
  )

  if (!school) return (
    <div className="px-10 py-6">Escola não encontrada</div>
  )

  return(
    <div className="flex flex-col gap-8 px-4 sm:px-8"> 
      <div className="flex flex-col gap-2 sm:flex-row  ">
        {/* IMAGEM */}
          <div className="flex w-full max-w-92 sm:w-4/5 min-h-64 justify-center rounded-lg relative">
            <Image fill src={"https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="escola"
              className="rounded-lg p-2 border-3 shadow-xs border-white/60" />
          </div>

          <div className="flex flex-col gap-2 text-justify sm:text-left sm:w-2/3">
            <div className="text-2xl">{school.name}</div>
            <div className="flex flex-row gap-2 items-center">
              <MapPin className="text-lg text-font-primary/60" />
              <p className="text-lg font-semibold text-font-primary/60">{school.city}</p>
            </div>
            <div className="p-4 bg-foreground rounded-md border">
              <p className="text-lg font-semibold text-font-primary/50">{school.description}</p>
            </div>
          </div>
      </div>

      <InfoBar data={stats}/>

      <EscolaTabs schoolId={school.id}/>
    </div>
  )
}
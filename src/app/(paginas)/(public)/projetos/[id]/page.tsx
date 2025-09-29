'use client'

import React from 'react'
import useSWR from 'swr'
import { PesquisadoresLista } from "@/components/pesquisador/PesquisadoresLista";
import { getProjectById } from "@/core/service/ProjetoService";
import { School } from "lucide-react";
import Image from "next/image";
import { Spinner } from "@/components/LoadingSpin";
import { useParams } from 'next/navigation';

export default function Page(){
  const { id } = useParams<{ id: string }>();
  const { data: project, error } = useSWR(id ? ["project", id] : null, () => getProjectById(id))

  if (!id) return <div className="px-10 py-6">ID inválido</div>
  if (!project && !error) return <div className="px-10 py-6"><Spinner size="large">Carregando...</Spinner></div>
  if (error) return <div className="px-10 py-6 text-red-600">{(error as Error)?.message || 'Erro desconhecido'}</div>
  if (!project) return <div className="px-10 py-6">Projeto não encontrado</div>

  return(
    <div className="w-full shadow p-8">
      <div className="text-3xl">{project.name}</div>
      <div className="text=x;">{project.description}</div>
      <div className="flex flex-row gap-0.5 items-center text-gray-500 mt-2">
        <School size={16} />
        <span className="text-sm">{project.school}</span>
      </div>
      <div className="pl-5 pt-2 overflow-y-auto">
        <div className="flex flex-row gap-5 py-7 border-b">
          <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
          <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
          <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
          <Image src={"https://picsum.photos/100/100"} alt={"Projeto"} width={164} height={164}></Image>
        </div>
      </div>

      <PesquisadoresLista projectId={project.id}/>
    </div>
  )
}
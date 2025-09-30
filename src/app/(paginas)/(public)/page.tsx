"use client"

import React from "react";
import useSWR from "swr";
import { GETictite } from "@/core/service/ICTITEService";
import { Ictite } from "@/core/interface/IIctite";
import { SearchBar } from "@/components/SearchBar";
import Mapa from "@/components/Mapa";
import { Spinner } from "@/components/LoadingSpin";
import { ChevronRight, School } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjetoPage() {
  const { data: projeto, error } = useSWR<Ictite, Error>("ictite", GETictite);

  if (!projeto && !error) return (
    <div className="px-8 py-6"><Spinner size="large">Carregando...</Spinner></div>
  )

  if (error) return (
    <div className="px-8 py-6 text-red-600">{error.message || 'Erro ao carregar projeto'}</div>
  )

  return (
    <div className="w-full px-8 flex flex-col gap-4 space-between rounded-xl">
      <div className="flex flex-row w-full gap-4">
        <div 
          className="
            sm:text-sm md:text-xl text-justify
            rounded-md w-full bg-cinza-light
            px-4 py-6 border-2 indent-4
          "
        >
          <h1 className="">{projeto?.objective}</h1>
        </div>
      </div>
      <SearchBar/>
      <div className="flex flex-col gap-1 h-full w-full p-2 mt-5 
        border-2 bg-cinza-light rounded-md">
        <div className="flex flex-row gap-2 justify-end items-center text-sm">
          <p className="border-l-2 pl-2">Total de escolas: XX</p>
          <p className="border-l-2 pl-2">Total de pesquisadores: XX</p>
          <p className="border-l-2 pl-2">Total de projetos: XX</p>
        </div>
        <Mapa />
      </div>

      {/* |=======| LISTA DAS ESCOLAS |=======| */}
      <div className="flex flex-col gap-2 mb-5 mt-3">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-semibold">Lista das Escolas</h2>
          <span>Total: XX</span>
        </div>
        {/* |=======| FUTURO COMPONENTE DE CARD DA ESCOLA |=======| */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} className="flex flex-row justify-between w-full h-14 border-2 rounded-md items-center px-3">
              <div className="flex flex-row gap-4 ">
                <School size={30} className="text-verde" />
                <span className="text-xl">Nome da escola</span>
              </div>
              <div className="">
                <Button size={"icon"} className="cursor-pointer">
                  <ChevronRight />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

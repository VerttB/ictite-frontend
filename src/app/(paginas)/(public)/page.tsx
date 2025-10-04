"use client"

import React, { useState } from "react";
import useSWR from "swr";
import { GETictite } from "@/core/service/ICTITEService";
import { Ictite } from "@/core/interface/IIctite";
import { SearchBar } from "@/components/SearchBar";
import Mapa from "@/components/Mapa";
import { Spinner } from "@/components/LoadingSpin";
import { ChevronRight, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import EscolaList from "@/components/escola/EscolaList";
import { SugestionBase } from "@/core/interface/SugestionBase";
import PesquisadorLoader from "@/components/pesquisador/PesquisadorLoader";
import ProjetoLoader from "@/components/projeto/ProjetoLoader";

export default function ProjetoPage() {

  const [resultadosBusca, setResultadosBusca] = useState<Record<string, SugestionBase[]>>({
    pesquisadores: [], 
    escolas: [], 
    projetos: []
  });

  const handleSugestoesChange = (novasSugestoes: Record<string, SugestionBase[]>) => {
    setResultadosBusca(novasSugestoes);
  };

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
            rounded-md w-full bg-foreground
            px-4 py-6 border-2 indent-4 border-border
          "
        >
          <h1 className="">{projeto?.objective}</h1>
        </div>
      </div>
      <SearchBar onSugestoesChange={handleSugestoesChange}/>
      <div className="flex flex-col gap-1 h-full w-full p-2 mt-5 
        border-2 bg-foreground rounded-md">
        <div className="flex flex-row gap-2 justify-end items-center text-sm">
          <p className="border-l-2 pl-2">Total de escolas: XX</p>
          <p className="border-l-2 pl-2">Total de pesquisadores: XX</p>
          <p className="border-l-2 pl-2">Total de projetos: XX</p>
        </div>
        <Mapa />
      </div>

      {/* |=======| LISTA DAS ESCOLAS |=======| */}
      <div id="escolas" className="flex flex-col gap-2 mb-5 mt-3">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-semibold">Lista das Escolas</h2>
          <span className="p-1 bg-foreground rounded-full shadow-sm hover:scale-105 transition-all cursor-default">
            Total: {resultadosBusca.escolas.length !== 0 ? (resultadosBusca.escolas.length) : ("XX")}
          </span>
        </div>
        {/* |=======| COMPONENTE DE CARD DA ESCOLA |=======| */}
        <EscolaList escolasBusca={resultadosBusca.escolas} />
      </div>

      {/* |=======| LISTA DOS PESQUISADORES |=======| */}
      <div className="flex flex-col gap-2 mb-5 mt-3">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-semibold">Lista dos Pesquisadores</h2>
          <span className="p-1 bg-foreground rounded-full shadow-sm hover:scale-105 transition-all cursor-default">
            Total: {resultadosBusca.pesquisadores.length}
          </span>
        </div>
        {/* |=======| COMPONENTE DE CARD DOS PESQUISADORES |=======| */}
        { resultadosBusca.pesquisadores.length !== 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
            {resultadosBusca.pesquisadores.map((pesquisador) => (
              <div key={pesquisador.id} >
                <PesquisadorLoader suggestion={pesquisador}/>
              </div>
            ))}
          </div>
        ) : (
          <div>
              <span>Nenhum resultado encontrado</span>
          </div>
        )}
      </div>

      {/* |=======| LISTA DOS PROJETOS |=======| */}
      <div className="flex flex-col gap-2 mb-5 mt-3">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-semibold">Lista dos Projetos</h2>
          <span className="p-1 bg-foreground rounded-full shadow-sm hover:scale-105 transition-all cursor-default">
            Total: {resultadosBusca.projetos.length}
          </span>
        </div>
        {/* |=======| COMPONENTE DE CARD DOS PROJETOS |=======| */}
        {resultadosBusca.projetos.length !== 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {resultadosBusca.projetos.map((projeto) => (
              <div key={projeto.id} className="">
                <ProjetoLoader sugestion={projeto} />
              </div>
            ))}
          </div>
        ) : (
          <div>
              <span>Nenhum resultado encontrado</span>
          </div>
        )}
      </div>

    </div>
  );
}

import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import {
  House,
  MapPin,
  PanelsTopLeft,
  Printer,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { useState, useMemo, useEffect } from "react";
import CardProjeto from "../card/CardProjeto";
import { Researcher } from "@/core/interface/Pesquisador/Researcher";
import { useFetch } from "@/hooks/useFetch";
import { ResearchSIMCC } from "@/core/interface/Pesquisador/ResearcherSIMCC";
import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";
import CardArtigo from "../card/CardArtigos";
import Masonry from "react-responsive-masonry";
import useSWR from "swr";
import { getResearcherById } from "@/core/service/Pesquisador/PesquisadorService";

interface PesquisadorProps {
  isOpen: boolean;
  onClose: () => void;
  researcherId: Researcher | null;
}

export default function Pesquisador({
  isOpen,
  onClose,
  researcherId,
}: PesquisadorProps) {
  if (!researcherId) return null;
  const [activePesquisadorTab, setActivePesquisadorTab] = useState("artigos");
  const {data:researcher, isLoading} = useSWR("simcc-researcher",() => getResearcherById(researcherId.id, true))
  if(!researcher) return null;
  if(researcher.articles)
    researcher.articles.sort( (a,b) => b.year - a.year)

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent>
        <DrawerHeader className="shadow">
          <div className="flex justify-start border-b items-center  pb-2.5 ">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={onClose}
              className="cursor-pointer"
            >
              <X />
            </Button>
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <div>
              <Image
                width={100}
                height={100}
                src={researcher.image ? `${researcher.image}` : "https://picsum.photos/100/100"}
                alt="pesquisador"
                className="rounded-md border border-cinza"
              />
            </div>
            <div className="items-center">
              <DrawerTitle>{researcher.name}</DrawerTitle>
              <div className="flex flex-row gap-1 items-center">
                <MapPin size={15} />
                <DrawerDescription className="font-semibold text-black">
                  {researcher.schoolcity}
                </DrawerDescription>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 flex flex-col px-6 py-2 overflow-hidden overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-full gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-verde" />
              <p className="text-sm text-gray-500">Carregando dados do pesquisador...</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-justify text-gray-500 mb-4">
                <p className="line-clamp-4 hover:line-clamp-none">
                 {researcher.simcc?.abstract ?? "Descrição não disponível."}
                </p>
              </div>

              <Tabs
                value={activePesquisadorTab}
                onValueChange={setActivePesquisadorTab}
              >
                <TabsList className="flex flex-row gap-5 w-full py-2 px-4 h-12 rounded-sm bg-blue-100">
                  <TabsTrigger value="artigos" asChild>
                    <Button
                      variant={
                        activePesquisadorTab === "artigos"
                          ? "default"
                          : "outline"
                      }
                      className="px-3 py-1 text-zinc-700 rounded-sm hover:bg-verde hover:text-branco data-[state=active]:bg-verde data-[state=active]:text-branco"
                    >
                      <House />
                      <p>Artigos</p>
                    </Button>
                  </TabsTrigger>

                  <TabsTrigger value="participacaoEventos" asChild>
                    <Button
                      variant={
                        activePesquisadorTab === "participacaoEventos"
                          ? "default"
                          : "outline"
                      }
                      className="px-3 py-1 text-zinc-700  hover:bg-verde hover:text-branco data-[state=active]:bg-verde data-[state=active]:text-branco"
                    >
                      <Printer />
                      <p>Participação Eventos</p>
                    </Button>
                  </TabsTrigger>

                  <TabsTrigger value="projetos" asChild>
                    <Button
                      variant={
                        activePesquisadorTab === "projetos"
                          ? "default"
                          : "outline"
                      }
                      className="px-3 py-1 text-zinc-700 hover:bg-verde hover:text-branco data-[state=active]:bg-verde data-[state=active]:text-branco"
                    >
                      <PanelsTopLeft />
                      <p>Projetos</p>
                    </Button>
                  </TabsTrigger>

                  <TabsTrigger value="livros_capitulos" asChild>
                    <Button
                      variant={
                        activePesquisadorTab === "livros_capitulos"
                          ? "default"
                          : "outline"
                      }
                      className="px-3 py-1 text-zinc-700 hover:bg-verde hover:text-branco data-[state=active]:bg-verde data-[state=active]:text-branco"
                    >
                      <PanelsTopLeft />
                      <p>Livros e Capítulos</p>
                    </Button>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="artigos" className="mt-4 ">
                  <Masonry 
                        columnsCount={3}
                        gutter="10px" >
                      {researcher.articles && researcher.articles.map((a,i) => 
                        <CardArtigo key={i} article={a}/>
                      )}
                  </Masonry>
                </TabsContent>

                <TabsContent value="participacaoEventos" className="mt-4">
                  <p>Participação Eventos</p>
                </TabsContent>

                <TabsContent value="projetos" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* {researcherFull.simcc?.projects?.map((projeto, i) => (
                      <CardProjeto key={i} data={projeto} />
                    ))} */}
                  </div>
                </TabsContent>

                <TabsContent value="livros_capitulos" className="mt-4">
                  <p>Livros e Capítulos</p>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

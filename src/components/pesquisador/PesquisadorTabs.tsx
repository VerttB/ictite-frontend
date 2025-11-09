'use client'
import { House, PanelsTopLeft, Printer } from "lucide-react"
import {  useState } from "react"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import Masonry from "react-responsive-masonry";
import CardArtigo from "../card/CardArtigos";
import useSWR from "swr";
import {  getResearcherProjects } from "@/core/service/PesquisadorService";
import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";
import CardProjeto from "../projeto/CardProjeto";
import { useViewPort } from "@/hooks/useViewPort";
import { ScrollArea } from "../ScrollArea"

export const PesquisadorTabs = ({researcher}: { researcher: ResearcherFinal}) => {
    const [activeTab, setActiveTab] = useState("artigos")
    const {data: projects} = useSWR(`researcher-projects-${researcher.id}`, () => getResearcherProjects(researcher.id))
    const { isMobile , isTablet} = useViewPort()

    if(!researcher) return null
    if(researcher.articles) researcher.articles.sort( (a,b) => b.year - a.year)

    return(
        <>
     
         <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex flex-col h-full min-h-0"
              >
                <TabsList className="flex flex-row gap-5 w-full py-2 px-4 h-12 rounded-sm bg-accent">
                  <TabsTrigger value="artigos" asChild>
                    <Button
                      variant={
                        activeTab === "artigos" ? "default": "outline"}>
                      <House />
                      <p>Artigos</p>
                    </Button>
                  </TabsTrigger>

                  <TabsTrigger value="participacaoEventos" asChild>
                    <Button
                      variant={
                        activeTab === "participacaoEventos"
                          ? "default"
                          : "outline"
                      }
                      className=""
                    >
                      <Printer />
                      <p>Participação Eventos</p>
                    </Button>
                  </TabsTrigger>

                  <TabsTrigger value="projetos" asChild>
                    <Button
                      variant={
                        activeTab === "projetos"
                          ? "default"
                          : "outline"
                      }
                    >
                      <PanelsTopLeft />
                      <p>Projetos</p>
                    </Button>
                  </TabsTrigger>

                  <TabsTrigger value="livros_capitulos" asChild>
                    <Button
                      variant={
                        activeTab === "livros_capitulos"
                          ? "default"
                          : "outline"
                      }
                    >
                      <PanelsTopLeft />
                      <p>Livros e Capítulos</p>
                    </Button>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="artigos" className="flex-1 min-h-0 flex flex-col">
                  <ScrollArea className="flex-1 min-h-0  mt-3">
                  { researcher.articles && researcher.articles.length > 0 ? (
                  <Masonry
                        columnsCount={isMobile ? 1 : isTablet ? 2 : 3}
                        gutter="10px" >
                      { researcher.articles.map((a,i) => 
                        <CardArtigo key={i} article={a}/>
                      )}
                  </Masonry>) : (
                    <div className="flex justify-center items-center h-full p-10">
                      <p>Nenhum artigo encontrado.</p>
                    </div>
                  )}
                </ScrollArea>
                </TabsContent>

                <TabsContent value="participacaoEventos" className="mt-4">
                  <p>Participação Eventos</p>
                </TabsContent>

                <TabsContent value="projetos" className="flex-1 min-h-0 flex flex-col">
                  {projects && projects.length > 0  ? (
                    <Masonry
                      columnsCount={isMobile ? 1 : isTablet ? 2 : 3}
                      gutter="10px"
                    >
                      {projects?.map((projeto, i) => (
                                  <CardProjeto key={i} project={projeto} />
                                ))}
                    </Masonry>) 
                    : (
                      <div className="flex justify-center items-center h-full p-10">
                        <p>Nenhum projeto encontrado.</p>
                      </div>
                    )}
                </TabsContent>

                <TabsContent value="livros_capitulos" className="mt-4">
                  <p>Livros e Capítulos</p>
                </TabsContent>
            
              </Tabs>
              </>
    )
}
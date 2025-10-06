'use client'
import { House, PanelsTopLeft, Printer } from "lucide-react"
import {  useState } from "react"
import { Button } from "../ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import Masonry from "react-responsive-masonry";
import CardArtigo from "../card/CardArtigos";
import useSWR from "swr";
import {  getResearcherProjects } from "@/core/service/PesquisadorService";
import { ResearcherFinal } from "@/core/interface/Pesquisador/ResearcherFinal";
import CardProjeto from "../projeto/CardProjeto";
import { useViewPort } from "@/hooks/useViewPort";

export const PesquisadorTabs = ({researcher}: { researcher: ResearcherFinal}) => {
    const [activeTab, setActiveTab] = useState("artigos")
    const {data: projects} = useSWR(`researcher-projects-${researcher.id}`, () => getResearcherProjects(researcher.id))
    const { isMobile , isTablet} = useViewPort()

    if(!researcher) return null
    researcher.articles.sort( (a,b) => b.year - a.year)

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
                        activeTab === "artigos"
                          ? "default"
                          : "outline"
                      }
                      className="px-3 py-1 text-zinc-700 rounded-sm hover:bg-primary hover:text-font-secondary data-[state=active]:bg-primary data-[state=active]:text-font-secondary"
                    >
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
                      className="px-3 py-1 text-zinc-700  hover:bg-primary hover:text-font-secondary data-[state=active]:bg-primary data-[state=active]:text-font-secondary"
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
                      className="px-3 py-1 text-zinc-700 hover:bg-primary hover:text-font-secondary data-[state=active]:bg-primary data-[state=active]:text-font-secondary"
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
                      className="px-3 py-1 text-zinc-700 hover:bg-primary hover:text-font-secondary data-[state=active]:bg-primary data-[state=active]:text-font-secondary"
                    >
                      <PanelsTopLeft />
                      <p>Livros e Capítulos</p>
                    </Button>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="artigos" className="flex-1 min-h-0 flex flex-col">
                  <Masonry
                        columnsCount={isMobile ? 1 : isTablet ? 2 : 3}
                        gutter="10px" >
                      {researcher.articles.map((a,i) => 
                        <CardArtigo key={i} article={a}/>
                      )}
                  </Masonry>
              
                </TabsContent>

                <TabsContent value="participacaoEventos" className="mt-4">
                  <p>Participação Eventos</p>
                </TabsContent>

                <TabsContent value="projetos" className="mt-4">
                    <Masonry
                        columnsCount={isMobile ? 1 : isTablet ? 2 : 3}
                        gutter="10px" >
              
                      {projects?.map((projeto, i) => (
                                  <CardProjeto key={i} project={projeto} />
                                ))}
                    </Masonry>
                </TabsContent>

                <TabsContent value="livros_capitulos" className="mt-4">
                  <p>Livros e Capítulos</p>
                </TabsContent>
            
              </Tabs>
              </>
    )
}
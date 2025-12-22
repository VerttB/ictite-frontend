"use client";
import { House, PanelsTopLeft, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Masonry from "react-responsive-masonry";
import CardArtigo from "../card/CardArtigos";
import useSWR from "swr";
import { getResearcherProjects } from "@/core/service/PesquisadorService";
import { ResearcherFinal } from "@/core/domain/Researcher";
import CardProjeto from "../projeto/ProjetoCard";
import { useViewPort } from "@/hooks/useViewPort";
import { ScrollArea } from "../ScrollArea";

export const PesquisadorTabs = ({
    researcher,
}: {
    researcher: ResearcherFinal;
}) => {
    const [activeTab, setActiveTab] = useState("artigos");
    const { isMobile, isTablet } = useViewPort();

    if (!researcher) return null;
    if (researcher.articles)
        researcher.articles.sort((a, b) => b.year - a.year);

    return (
        <>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex h-full min-h-0 flex-col">
                <TabsList className="bg-accent flex h-12 w-full flex-row gap-5 overflow-hidden overflow-x-auto rounded-sm px-4 py-2">
                    <TabsTrigger value="artigos" asChild>
                        <Button
                            variant={
                                activeTab === "artigos" ? "default" : "outline"
                            }>
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
                            className="">
                            <Printer />
                            <p>Participação Eventos</p>
                        </Button>
                    </TabsTrigger>

                    <TabsTrigger value="projetos" asChild>
                        <Button
                            variant={
                                activeTab === "projetos" ? "default" : "outline"
                            }>
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
                            }>
                            <PanelsTopLeft />
                            <p>Livros e Capítulos</p>
                        </Button>
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    value="artigos"
                    className="flex min-h-0 flex-1 flex-col">
                    <ScrollArea className="mt-3 min-h-0 flex-1">
                        {researcher.articles &&
                        researcher.articles.length > 0 ? (
                            <Masonry
                                columnsCount={isMobile ? 1 : isTablet ? 2 : 3}
                                gutter="10px">
                                {researcher.articles.map((a, i) => (
                                    <CardArtigo key={i} article={a} />
                                ))}
                            </Masonry>
                        ) : (
                            <div className="flex h-full items-center justify-center p-10">
                                <p>Nenhum artigo encontrado.</p>
                            </div>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="participacaoEventos" className="mt-4">
                    <p>Participação Eventos</p>
                </TabsContent>

                <TabsContent
                    value="projetos"
                    className="flex min-h-0 flex-1 flex-col">
                    <Masonry
                        columnsCount={isMobile ? 1 : isTablet ? 2 : 4}
                        gutter="10px">
                        {Object.entries(researcher.projects).map(
                            ([year, projects]) =>
                                projects.map((project) => (
                                    <CardProjeto
                                        key={project.id}
                                        project={project}
                                    />
                                ))
                        )}
                    </Masonry>
                </TabsContent>

                <TabsContent value="livros_capitulos" className="mt-4">
                    <p>Livros e Capítulos</p>
                </TabsContent>
            </Tabs>
        </>
    );
};

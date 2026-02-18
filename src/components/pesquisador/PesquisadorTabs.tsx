"use client";
import { House, PanelsTopLeft, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Masonry from "react-responsive-masonry";
import CardArtigo from "../card/CardArtigos";
import { ResearcherArticles, ResearcherFinal } from "@/core/domain/Researcher";
import CardProjeto from "../projeto/ProjetoCard";
import { useViewPort } from "@/hooks/useViewPort";
import { TabsConfig } from "@/core/interface/TabsConfig";
import { TabsGrid } from "../ui/TabsGridGeneric";
import CardNaoEncontrado from "../card/CardNaoEncontrado";

export const PesquisadorTabs = ({ researcher }: { researcher: ResearcherFinal }) => {
    const [activeTab, setActiveTab] = useState("artigos");
    const { isMobile, isTablet } = useViewPort();

    const sortedArticles = useMemo(() => {
        if (!researcher.articles) return [];
        return [...researcher.articles].sort((a, b) => b.year - a.year);
    }, [researcher]);
    const tabsConfig: TabsConfig[] = [
        {
            value: "artigos",
            label: "Artigos",
            icon: House,
            isLoading: false,
            isError: false,
            data: sortedArticles,
            layoutType: "masonry",
            masonryGutter: "10px",
            minCardWidth: "250px",
            renderItem: (item: ResearcherArticles) => (
                <CardArtigo key={item.id} article={item} />
            ),
        },
        {
            value: "participacaoEventos",
            label: "Participação Eventos",
            icon: Printer,
            isLoading: false,
            isError: false,
            data: [],
            layoutType: "list",
            renderItem: (item: any) => <div key={item.id}>Evento {item.id}</div>, //eslint-disable-line
        },
        {
            value: "projetos",
            label: "Projetos",
            icon: PanelsTopLeft,
            isLoading: false,
            isError: false,
            children:
                Object.entries(researcher.projects).length > 0 ? (
                    <Masonry columnsCount={isMobile ? 1 : isTablet ? 2 : 4} gutter="10px">
                        {Object.entries(researcher.projects).map(([, projects]) =>
                            projects.map((project) => (
                                <CardProjeto key={project.id} project={project} />
                            ))
                        )}
                    </Masonry>
                ) : (
                    <div className="mt-4">
                        <CardNaoEncontrado text="Nenhum projeto encontrado." />
                    </div>
                ),
        },
        {
            value: "livros_capitulos",
            label: "Livros e Capítulos",
            icon: PanelsTopLeft,
            isLoading: false,
            isError: false,
            data: [],
            layoutType: "list",
            renderItem: (item: any) => <div key={item.id}>Livro/Capítulo {item.id}</div>, //eslint-disable-line
        },
    ];
    if (!researcher) return null;
    return (
        <>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex h-full min-h-0 flex-col">
                <TabsList className="bg-accent flex h-12 w-full flex-row gap-5 overflow-hidden overflow-x-auto rounded-sm px-4 py-2">
                    {tabsConfig.map(({ value, label, icon: Icon }) => (
                        <TabsTrigger key={value} value={value} asChild>
                            <Button
                                variant={activeTab === value ? "default" : "outline"}
                                className="flex items-center gap-2">
                                <Icon size={16} />
                                <span>{label}</span>
                            </Button>
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabsConfig.map((tabs) => (
                    <TabsContent
                        key={tabs.value}
                        value={tabs.value}
                        className="flex min-h-0 flex-1 flex-col">
                        {tabs.children ? (
                            tabs.children
                        ) : (
                            <TabsGrid
                                isLoading={tabs.isLoading}
                                isError={tabs.isError}
                                data={tabs.data}
                                renderItem={tabs.renderItem}
                                layoutType={tabs.layoutType}
                                minCardWidth={tabs.minCardWidth}
                                masonryGutter={tabs.masonryGutter}
                                className={tabs.className}
                            />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
};

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { House, Printer, PanelsTopLeft, Brain } from "lucide-react";

import { useState } from "react";
import {
    useSchoolEquipments,
    useSchoolProjects,
    useSchoolResearchers,
} from "@/hooks/useSchools";
import { Spinner } from "../LoadingSpin";
import CardProjeto from "../projeto/ProjetoCard";
import CardEquipamento from "../card/CardEquipamento";
import ClubeCienciaTabs from "../clubeCiencia/ClubeCienciaTabs";
import CardPesquisador from "../pesquisador/PesquisadorCard";

export const EscolaTabs = ({ schoolId }: { schoolId: string }) => {
    const [activeTab, setActiveTab] = useState("pesquisadores");

    const { researchers, isLoading: loadingRes } =
        useSchoolResearchers(schoolId);
    const { equipments, isLoading: loadingEq } = useSchoolEquipments(schoolId);
    const { projects, isLoading: loadingPr } = useSchoolProjects(schoolId);

    return (
        <>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full">
                <TabsList className="bg-accent flex w-full flex-row gap-5 overflow-hidden overflow-x-auto rounded-md px-4 py-2">
                    <TabsTrigger value="pesquisadores" asChild>
                        <Button
                            variant={
                                activeTab === "pesquisadores"
                                    ? "default"
                                    : "outline"
                            }>
                            <House /> Pesquisadores
                        </Button>
                    </TabsTrigger>
                    <TabsTrigger value="equipamentos" asChild>
                        <Button
                            variant={
                                activeTab === "equipamentos"
                                    ? "default"
                                    : "outline"
                            }>
                            <Printer /> Equipamentos
                        </Button>
                    </TabsTrigger>
                    <TabsTrigger value="projetos" asChild>
                        <Button
                            variant={
                                activeTab === "projetos" ? "default" : "outline"
                            }>
                            <PanelsTopLeft /> Projetos
                        </Button>
                    </TabsTrigger>
                    <TabsTrigger value="clube de ciência" asChild>
                        <Button
                            variant={
                                activeTab === "clube de ciência"
                                    ? "default"
                                    : "outline"
                            }>
                            <Brain /> Clube de Ciênica
                        </Button>
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="pesquisadores"
                    className="mt-4 grid w-full [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-4">
                    {loadingRes ? (
                        <Spinner />
                    ) : (
                        researchers?.map((r) => (
                            <CardPesquisador
                                key={r.id ?? r.name}
                                researcher={r}
                            />
                        ))
                    )}
                </TabsContent>

                <TabsContent
                    value="equipamentos"
                    className="mt-4 grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-4">
                    {loadingEq ? (
                        <Spinner />
                    ) : (
                        equipments?.map((e, i) => (
                            <CardEquipamento key={i} equipment={e} />
                        ))
                    )}
                </TabsContent>

                <TabsContent
                    value="projetos"
                    className="mt-4 grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-4">
                    {loadingPr ? (
                        <Spinner />
                    ) : (
                        projects?.map((p, i) => (
                            <CardProjeto key={i} project={p} />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="clube de ciência">
                    {projects ? (
                        <ClubeCienciaTabs
                            projetosClubeCiencia={projects}
                            school_id={schoolId}
                        />
                    ) : (
                        "Não passou projetos"
                    )}
                </TabsContent>
            </Tabs>
        </>
    );
};

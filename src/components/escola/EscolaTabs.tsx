"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { House, Printer, PanelsTopLeft, Brain, BookOpen } from "lucide-react";
import { useState } from "react";
import {
    useSchoolEquipments,
    useSchoolProjects,
    useSchoolResearchers,
} from "@/hooks/useSchools";
import { Spinner } from "../LoadingSpin";
import CardProjeto from "../projeto/ProjetoCard";
import CardEquipamento from "../card/CardEquipamento";
import CardPesquisador from "../pesquisador/PesquisadorCard";
import { School } from "@/core/domain/School";
import useSWR from "swr";
import ClubeCienciaCard from "../clubeCiencia/ClubeCienciaCard";
import { getSchoolClubs } from "@/core/service/SchoolService";
import { TabsConfig } from "@/core/interface/TabsConfig";
import { TabsGrid } from "../ui/TabsGridGeneric";
import { Project } from "@/core/domain/Project";
import { Equipment } from "@/core/domain/Equipment";
import { Researcher } from "@/core/domain/Researcher";
import { ScienceClub } from "@/core/domain/Club";

interface EscolaTabsProps {
    school: School;
}

export const EscolaTabs = ({ school }: EscolaTabsProps) => {
    const [activeTab, setActiveTab] = useState("pesquisadores");
    const {
        equipments,
        isLoading: loadingEq,
        errorEquipments: errorEq,
    } = useSchoolEquipments(school.id);
    const {
        projects,
        isLoading: loadingProj,
        errorProjects: errorProj,
    } = useSchoolProjects(school.id);
    const {
        researchers,
        isLoading: loadingRes,
        errorReseachers: errorRes,
    } = useSchoolResearchers(school.id);

    const {
        data: clubes,
        isLoading: loadingClube,
        error: errorClubs,
    } = useSWR("clube-by-school-" + school.id, () => getSchoolClubs(school.id));

    const tabsConfig: TabsConfig[] = [
        {
            value: "pesquisadores",
            label: "Pesquisadores",
            icon: BookOpen,
            isLoading: loadingRes,
            isError: errorRes,
            emptyMessage: "Nenhum pesquisador encontrado para esta escola.",
            data: researchers || [],
            renderItem: (r: Researcher) => (
                <CardPesquisador key={r.id ?? r.name} researcher={r} />
            ),
        },
        {
            value: "equipamentos",
            label: "Equipamentos",
            icon: Printer,
            isLoading: loadingEq,
            isError: errorEq,
            emptyMessage: "Nenhum equipamento encontrado para esta escola.",
            data: equipments || [],
            renderItem: (e: Equipment) => (
                <CardEquipamento key={e.id} equipment={e} />
            ),
        },
        {
            value: "projetos",
            label: "Projetos",
            icon: PanelsTopLeft,
            isLoading: loadingProj,
            isError: errorProj,
            emptyMessage: "Nenhum projeto encontrado para esta escola.",
            data: projects || [],
            renderItem: (p: Project) => <CardProjeto key={p.id} project={p} />,
        },
        {
            value: "clube de ciência",
            label: "Clube de Ciência",
            icon: Brain,
            isLoading: loadingClube,
            isError: errorClubs,
            emptyMessage:
                "Nenhum clube de ciência encontrado para esta escola.",
            data: clubes || [],
            renderItem: (clube: ScienceClub) => (
                <ClubeCienciaCard key={clube.id} clubeCiencia={clube} />
            ),
        },
    ];
    return (
        <>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full">
                <TabsList className="bg-accent flex w-full flex-row gap-5 overflow-hidden overflow-x-auto rounded-md px-4 py-2">
                    {tabsConfig.map(({ value, label, icon: Icon }) => (
                        <TabsTrigger key={value} value={value} asChild>
                            <Button
                                variant={
                                    activeTab === value ? "default" : "outline"
                                }
                                className="flex items-center gap-2">
                                <Icon size={16} />
                                <span>{label}</span>
                            </Button>
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabsConfig.map((tabs) => (
                    <TabsContent key={tabs.value} value={tabs.value}>
                        <TabsGrid
                            isLoading={tabs.isLoading}
                            isError={tabs.isError}
                            data={tabs.data}
                            renderItem={tabs.renderItem}
                            emptyMessage={tabs.emptyMessage}
                            minCardWidth={tabs.minCardWidth}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
};

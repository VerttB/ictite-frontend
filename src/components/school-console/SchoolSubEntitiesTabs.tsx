"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Handshake, SquareChartGantt, Book, Printer, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SchoolFormDraftData } from "@/schemas/schoolSubmissionSchema";
import { ClubItemForm } from "./sub-entities/ClubItemForm";
import { ProjectItemForm } from "./sub-entities/ProjectItemForm";
import { ResearcherItemForm } from "./sub-entities/ResearcherItemForm";
import { EquipmentItemForm } from "./sub-entities/EquipmentItemForm";

export type TabType = "clubs" | "projects" | "researchers" | "equipments";

interface SchoolSubEntitiesTabsProps {
    form: UseFormReturn<SchoolFormDraftData>;
    readOnly?: boolean;
    activeTab: TabType;
}

export function SchoolSubEntitiesTabs({
    form,
    readOnly = false,
    activeTab,
}: SchoolSubEntitiesTabsProps) {
    const { control, watch } = form;
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: prev[id] === undefined ? false : !prev[id],
        }));
    };

    const isItemExpanded = (id: string) => expandedItems[id] !== false;

    const { fields: clubFields, append: appendClub, remove: removeClub } = useFieldArray({
        control,
        name: "clubs",
    });

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control,
        name: "projects",
    });

    const { fields: researcherFields, append: appendResearcher, remove: removeResearcher } = useFieldArray({
        control,
        name: "researchers",
    });

    const { fields: equipmentFields, append: appendEquipment, remove: removeEquipment } = useFieldArray({
        control,
        name: "equipments",
    });

    const currentClubs = watch("clubs") || [];
    const currentProjects = watch("projects") || [];

    const handleAddClub = () => {
        const id = crypto.randomUUID();
        appendClub({ id, name: "", instagram_url: "" });
        setExpandedItems((prev) => ({ ...prev, [id]: true }));
    };

    const handleAddProject = () => {
        const id = crypto.randomUUID();
        appendProject({
            id,
            name: "",
            description: "",
            clube_ciencia_id: currentClubs[0]?.id || "",
            year: new Date().getFullYear(),
        });
        setExpandedItems((prev) => ({ ...prev, [id]: true }));
    };

    const handleAddResearcher = () => {
        const id = crypto.randomUUID();
        appendResearcher({
            id,
            name: "",
            type: "Aluno",
            gender: "Não informado",
            race: "Não informado",
            lattes_id: "",
            project_ids: [],
        });
        setExpandedItems((prev) => ({ ...prev, [id]: true }));
    };

    const handleAddEquipment = () => {
        const id = crypto.randomUUID();
        appendEquipment({
            id,
            name: "",
            quantity: 1,
            type_equipment_id: "",
        });
        setExpandedItems((prev) => ({ ...prev, [id]: true }));
    };

    const getSectionHeader = () => {
        switch (activeTab) {
            case "clubs":
                return { title: `Clubes de Ciência (${clubFields.length})`, icon: Handshake, onAdd: handleAddClub };
            case "projects":
                return { title: `Projetos de Pesquisa (${projectFields.length})`, icon: SquareChartGantt, onAdd: handleAddProject };
            case "researchers":
                return { title: `Pesquisadores (${researcherFields.length})`, icon: Book, onAdd: handleAddResearcher };
            case "equipments":
                return { title: `Equipamentos (${equipmentFields.length})`, icon: Printer, onAdd: handleAddEquipment };
        }
    };

    const headerInfo = getSectionHeader();
    const HeaderIcon = headerInfo.icon;

    return (
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Header da Seção Ativa */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-[#088077]">
                    <HeaderIcon size={20} />
                    <h3 className="text-base font-bold text-gray-800">{headerInfo.title}</h3>
                </div>

                {!readOnly && (
                    <Button
                        type="button"
                        onClick={headerInfo.onAdd}
                        className="bg-[#088077] hover:bg-[#088077]/90 text-white rounded-full text-xs font-semibold px-4 py-2 gap-1.5 shadow-xs"
                    >
                        <Plus size={16} />
                        Adicionar
                    </Button>
                )}
            </div>

            {/* Conteúdo por Aba Ativa */}
            <div className="mt-6 space-y-4">
                {/* 1. CLUBES DE CIÊNCIA */}
                {activeTab === "clubs" && (
                    clubFields.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            Nenhum clube de ciência cadastrado. Clique em <strong>+ Adicionar</strong> para cadastrar.
                        </div>
                    ) : (
                        clubFields.map((field, index) => (
                            <ClubItemForm
                                key={field.id}
                                index={index}
                                fieldId={field.id}
                                form={form}
                                readOnly={readOnly}
                                isExpanded={isItemExpanded(field.id)}
                                onToggleExpand={() => toggleExpand(field.id)}
                                onRemove={() => removeClub(index)}
                            />
                        ))
                    )
                )}

                {/* 2. PROJETOS DE PESQUISA */}
                {activeTab === "projects" && (
                    projectFields.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            Nenhum projeto cadastrado. Clique em <strong>+ Adicionar</strong> para criar um projeto.
                        </div>
                    ) : (
                        projectFields.map((field, index) => (
                            <ProjectItemForm
                                key={field.id}
                                index={index}
                                fieldId={field.id}
                                form={form}
                                clubs={currentClubs}
                                readOnly={readOnly}
                                isExpanded={isItemExpanded(field.id)}
                                onToggleExpand={() => toggleExpand(field.id)}
                                onRemove={() => removeProject(index)}
                            />
                        ))
                    )
                )}

                {/* 3. PESQUISADORES */}
                {activeTab === "researchers" && (
                    researcherFields.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            Nenhum pesquisador cadastrado. Clique em <strong>+ Adicionar</strong> para incluir alunos, professores ou facilitadores.
                        </div>
                    ) : (
                        researcherFields.map((field, index) => (
                            <ResearcherItemForm
                                key={field.id}
                                index={index}
                                fieldId={field.id}
                                form={form}
                                projects={currentProjects}
                                readOnly={readOnly}
                                isExpanded={isItemExpanded(field.id)}
                                onToggleExpand={() => toggleExpand(field.id)}
                                onRemove={() => removeResearcher(index)}
                            />
                        ))
                    )
                )}

                {/* 4. EQUIPAMENTOS */}
                {activeTab === "equipments" && (
                    equipmentFields.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            Nenhum equipamento cadastrado. Clique em <strong>+ Adicionar</strong> para incluir equipamentos laboratoriais.
                        </div>
                    ) : (
                        equipmentFields.map((field, index) => (
                            <EquipmentItemForm
                                key={field.id}
                                index={index}
                                fieldId={field.id}
                                form={form}
                                readOnly={readOnly}
                                isExpanded={isItemExpanded(field.id)}
                                onToggleExpand={() => toggleExpand(field.id)}
                                onRemove={() => removeEquipment(index)}
                            />
                        ))
                    )
                )}
            </div>
        </div>
    );
}

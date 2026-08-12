"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import {
    Handshake,
    SquareChartGantt,
    Book,
    Printer,
    Plus,
    Trash2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import { SchoolFormDraftData } from "@/schemas/schoolSubmissionSchema";

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
    const { register, control, watch, formState: { errors } } = form;
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: prev[id] === undefined ? false : !prev[id],
        }));
    };

    const isItemExpanded = (id: string) => {
        return expandedItems[id] !== false;
    };

    const {
        fields: clubFields,
        append: appendClub,
        remove: removeClub,
    } = useFieldArray({ control, name: "clubs" });

    const {
        fields: projectFields,
        append: appendProject,
        remove: removeProject,
    } = useFieldArray({ control, name: "projects" });

    const {
        fields: researcherFields,
        append: appendResearcher,
        remove: removeResearcher,
    } = useFieldArray({ control, name: "researchers" });

    const {
        fields: equipmentFields,
        append: appendEquipment,
        remove: removeEquipment,
    } = useFieldArray({ control, name: "equipments" });

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
            type_equipment_id: "00000000-0000-0000-0000-000000000000",
        });
        setExpandedItems((prev) => ({ ...prev, [id]: true }));
    };

    const getSectionHeader = () => {
        switch (activeTab) {
            case "clubs":
                return {
                    title: `Clubes de Ciência (${clubFields.length})`,
                    icon: Handshake,
                    onAdd: handleAddClub,
                };
            case "projects":
                return {
                    title: `Projetos de Pesquisa (${projectFields.length})`,
                    icon: SquareChartGantt,
                    onAdd: handleAddProject,
                };
            case "researchers":
                return {
                    title: `Pesquisadores (${researcherFields.length})`,
                    icon: Book,
                    onAdd: handleAddResearcher,
                };
            case "equipments":
                return {
                    title: `Equipamentos (${equipmentFields.length})`,
                    icon: Printer,
                    onAdd: handleAddEquipment,
                };
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
                    <button
                        type="button"
                        onClick={headerInfo.onAdd}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#088077] px-4 py-2 text-xs font-semibold text-white hover:bg-[#088077]/90 transition-all shadow-sm"
                    >
                        <Plus size={16} />
                        Adicionar
                    </button>
                )}
            </div>

            {/* Conteúdo Expansível/Retrátil */}
            <div className="mt-6 space-y-4">
                {/* 1. CLUBES DE CIÊNCIA */}
                {activeTab === "clubs" && (
                    clubFields.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            Nenhum clube de ciência cadastrado. Clique em <strong>+ Adicionar</strong> para cadastrar.
                        </div>
                    ) : (
                        clubFields.map((field, index) => {
                            const expanded = isItemExpanded(field.id);
                            const clubName = watch(`clubs.${index}.name`);

                            return (
                                <div
                                    key={field.id}
                                    className="relative flex flex-col rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden"
                                >
                                    {/* Item Header / Summary Bar */}
                                    <div
                                        onClick={() => toggleExpand(field.id)}
                                        className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-[#088077]/10 p-1.5 text-[#088077]">
                                                <Handshake size={16} />
                                            </span>
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                {clubName || `Clube de Ciência #${index + 1}`}
                                            </h4>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!readOnly && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeClub(index);
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                    title="Remover clube"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                                            >
                                                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Item Form Body (Visible when expanded) */}
                                    {expanded && (
                                        <div className="p-5 space-y-4 animate-fade-in bg-white">
                                            <input type="hidden" {...register(`clubs.${index}.id`)} />

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Nome do Clube de Ciência *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        disabled={readOnly}
                                                        placeholder="Ex: Clube de Astronomia Galileu"
                                                        {...register(`clubs.${index}.name`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    />
                                                    {errors.clubs?.[index]?.name && (
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                                            <AlertCircle size={12} />
                                                            {errors.clubs[index]?.name?.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        URL do Instagram (Opcional)
                                                    </label>
                                                    <input
                                                        type="url"
                                                        disabled={readOnly}
                                                        placeholder="https://instagram.com/clube"
                                                        {...register(`clubs.${index}.instagram_url`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )
                )}

                {/* 2. PROJETOS DE PESQUISA */}
                {activeTab === "projects" && (
                    projectFields.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            Nenhum projeto cadastrado. Clique em <strong>+ Adicionar</strong> para criar um projeto.
                        </div>
                    ) : (
                        projectFields.map((field, index) => {
                            const expanded = isItemExpanded(field.id);
                            const projectName = watch(`projects.${index}.name`);

                            return (
                                <div
                                    key={field.id}
                                    className="relative flex flex-col rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden"
                                >
                                    <div
                                        onClick={() => toggleExpand(field.id)}
                                        className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-[#088077]/10 p-1.5 text-[#088077]">
                                                <SquareChartGantt size={16} />
                                            </span>
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                {projectName || `Projeto de Pesquisa #${index + 1}`}
                                            </h4>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!readOnly && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeProject(index);
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                                            >
                                                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {expanded && (
                                        <div className="p-5 space-y-4 animate-fade-in bg-white">
                                            <input type="hidden" {...register(`projects.${index}.id`)} />

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Nome do Projeto *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        disabled={readOnly}
                                                        placeholder="Ex: Monitoramento da Qualidade da Água"
                                                        {...register(`projects.${index}.name`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    />
                                                    {errors.projects?.[index]?.name && (
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                                            <AlertCircle size={12} />
                                                            {errors.projects[index]?.name?.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Ano
                                                    </label>
                                                    <input
                                                        type="number"
                                                        disabled={readOnly}
                                                        {...register(`projects.${index}.year`, { valueAsNumber: true })}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Clube de Ciência Vinculado *
                                                </label>
                                                <select
                                                    disabled={readOnly}
                                                    {...register(`projects.${index}.clube_ciencia_id`)}
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                >
                                                    {currentClubs.length === 0 ? (
                                                        <option value="">Nenhum clube cadastrado - Crie um clube na primeira aba</option>
                                                    ) : (
                                                        currentClubs.map((club) => (
                                                            <option key={club.id} value={club.id}>
                                                                {club.name}
                                                            </option>
                                                        ))
                                                    )}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Descrição / Resumo
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    disabled={readOnly}
                                                    placeholder="Breve resumo sobre os objetivos do projeto..."
                                                    {...register(`projects.${index}.description`)}
                                                    className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100 resize-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )
                )}

                {/* 3. PESQUISADORES */}
                {activeTab === "researchers" && (
                    researcherFields.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            Nenhum pesquisador cadastrado. Clique em <strong>+ Adicionar</strong> para incluir alunos, professores ou facilitadores.
                        </div>
                    ) : (
                        researcherFields.map((field, index) => {
                            const expanded = isItemExpanded(field.id);
                            const researcherName = watch(`researchers.${index}.name`);
                            const researcherType = watch(`researchers.${index}.type`);

                            return (
                                <div
                                    key={field.id}
                                    className="relative flex flex-col rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden"
                                >
                                    <div
                                        onClick={() => toggleExpand(field.id)}
                                        className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-[#088077]/10 p-1.5 text-[#088077]">
                                                <Book size={16} />
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-gray-800">
                                                    {researcherName || `Pesquisador #${index + 1}`}
                                                </h4>
                                                <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                                                    {researcherType}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!readOnly && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeResearcher(index);
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                                            >
                                                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {expanded && (
                                        <div className="p-5 space-y-4 animate-fade-in bg-white">
                                            <input type="hidden" {...register(`researchers.${index}.id`)} />

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Nome Completo *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        disabled={readOnly}
                                                        placeholder="Ex: Maria Clara Souza"
                                                        {...register(`researchers.${index}.name`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    />
                                                    {errors.researchers?.[index]?.name && (
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                                            <AlertCircle size={12} />
                                                            {errors.researchers[index]?.name?.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Função / Tipo *
                                                    </label>
                                                    <select
                                                        disabled={readOnly}
                                                        {...register(`researchers.${index}.type`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    >
                                                        <option value="Aluno">Aluno</option>
                                                        <option value="Professor">Professor</option>
                                                        <option value="Facilitador">Facilitador</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Gênero
                                                    </label>
                                                    <select
                                                        disabled={readOnly}
                                                        {...register(`researchers.${index}.gender`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    >
                                                        <option value="Homem Cisgênero">Homem Cisgênero</option>
                                                        <option value="Mulher Cisgênero">Mulher Cisgênero</option>
                                                        <option value="Homem Trans">Homem Trans</option>
                                                        <option value="Mulher Trans">Mulher Trans</option>
                                                        <option value="Outro">Outro</option>
                                                        <option value="Não informado">Não informado</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Raça / Etnia
                                                    </label>
                                                    <select
                                                        disabled={readOnly}
                                                        {...register(`researchers.${index}.race`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    >
                                                        <option value="Branca">Branca</option>
                                                        <option value="Preta">Preta</option>
                                                        <option value="Parda">Parda</option>
                                                        <option value="Indígena">Indígena</option>
                                                        <option value="Amarela">Amarela</option>
                                                        <option value="Não informado">Não informado</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        ID Lattes (16 dígitos)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        maxLength={16}
                                                        disabled={readOnly}
                                                        placeholder="1234567890123456"
                                                        {...register(`researchers.${index}.lattes_id`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all font-mono disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Projetos Vinculados
                                                </label>
                                                <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm">
                                                    {currentProjects.length === 0 ? (
                                                        <span className="text-xs text-gray-400">Nenhum projeto cadastrado ainda.</span>
                                                    ) : (
                                                        currentProjects.map((p) => (
                                                            <label key={p.id} className="flex items-center gap-2 cursor-pointer text-xs">
                                                                <input
                                                                    type="checkbox"
                                                                    disabled={readOnly}
                                                                    value={p.id}
                                                                    {...register(`researchers.${index}.project_ids`)}
                                                                    className="rounded text-[#088077] focus:ring-[#088077]"
                                                                />
                                                                <span>{p.name}</span>
                                                            </label>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )
                )}

                {/* 4. EQUIPAMENTOS */}
                {activeTab === "equipments" && (
                    equipmentFields.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                            Nenhum equipamento cadastrado. Clique em <strong>+ Adicionar</strong> para incluir equipamentos laboratoriais.
                        </div>
                    ) : (
                        equipmentFields.map((field, index) => {
                            const expanded = isItemExpanded(field.id);
                            const equipmentName = watch(`equipments.${index}.name`);
                            const equipmentQty = watch(`equipments.${index}.quantity`);

                            return (
                                <div
                                    key={field.id}
                                    className="relative flex flex-col rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden"
                                >
                                    <div
                                        onClick={() => toggleExpand(field.id)}
                                        className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-[#088077]/10 p-1.5 text-[#088077]">
                                                <Printer size={16} />
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-gray-800">
                                                    {equipmentName || `Equipamento #${index + 1}`}
                                                </h4>
                                                <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                                                    {equipmentQty || 1} un
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {!readOnly && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeEquipment(index);
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                                            >
                                                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {expanded && (
                                        <div className="p-5 space-y-4 animate-fade-in bg-white">
                                            <input type="hidden" {...register(`equipments.${index}.id`)} />
                                            <input type="hidden" {...register(`equipments.${index}.type_equipment_id`)} />

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Nome do Equipamento *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        disabled={readOnly}
                                                        placeholder="Ex: Microscópio Biológico Binocular"
                                                        {...register(`equipments.${index}.name`)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    />
                                                    {errors.equipments?.[index]?.name && (
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                                            <AlertCircle size={12} />
                                                            {errors.equipments[index]?.name?.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                        Quantidade *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        disabled={readOnly}
                                                        {...register(`equipments.${index}.quantity`, { valueAsNumber: true })}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )
                )}
            </div>
        </div>
    );
}

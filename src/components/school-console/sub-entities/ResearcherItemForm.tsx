"use client";

import { UseFormReturn } from "react-hook-form";
import { Book, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SchoolFormDraftData, ProjectDraftData } from "@/schemas/schoolSubmissionSchema";
import { ResearcherTypes } from "@/core/constants/researcherType";
import { GenderTypes } from "@/core/constants/sex";
import { RaceTypes } from "@/core/constants/race";

interface ResearcherItemFormProps {
    index: number;
    fieldId: string;
    form: UseFormReturn<SchoolFormDraftData>;
    projects: ProjectDraftData[];
    readOnly?: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onRemove: () => void;
}

export function ResearcherItemForm({
    index,
    fieldId,
    form,
    projects,
    readOnly = false,
    isExpanded,
    onToggleExpand,
    onRemove,
}: ResearcherItemFormProps) {
    const { register, watch, formState: { errors } } = form;
    const researcherName = watch(`researchers.${index}.name`);
    const researcherType = watch(`researchers.${index}.type`);

    return (
        <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden">
            <div
                onClick={onToggleExpand}
                className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-[#088077]/10 p-2 text-[#088077]">
                        <Book size={18} />
                    </span>
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                            {researcherName || `Pesquisador #${index + 1}`}
                        </h4>
                        <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                            {researcherType}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {!readOnly && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            className="text-red-500 hover:bg-red-50 hover:text-red-700 h-8 w-8"
                        >
                            <Trash2 size={16} />
                        </Button>
                    )}
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-5 space-y-4 animate-fade-in bg-white">
                    <input type="hidden" {...register(`researchers.${index}.id`)} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Nome Completo *
                            </label>
                            <Input
                                disabled={readOnly}
                                placeholder="Ex: Maria Clara Souza"
                                {...register(`researchers.${index}.name`)}
                            />
                            {errors.researchers?.[index]?.name && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
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
                                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                            >
                                {Object.values(ResearcherTypes).map((typeVal) => (
                                    <option key={typeVal} value={typeVal}>
                                        {typeVal}
                                    </option>
                                ))}
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
                                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                            >
                                {Object.values(GenderTypes).map((genderVal) => (
                                    <option key={genderVal} value={genderVal}>
                                        {genderVal}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Raça / Etnia
                            </label>
                            <select
                                disabled={readOnly}
                                {...register(`researchers.${index}.race`)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                            >
                                {Object.values(RaceTypes).map((raceVal) => (
                                    <option key={raceVal} value={raceVal}>
                                        {raceVal}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                ID Lattes (16 dígitos)
                            </label>
                            <Input
                                maxLength={16}
                                disabled={readOnly}
                                placeholder="1234567890123456"
                                className="font-mono text-sm"
                                {...register(`researchers.${index}.lattes_id`)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Projetos Vinculados
                        </label>
                        <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-sm">
                            {projects.length === 0 ? (
                                <span className="text-xs text-gray-400">Nenhum projeto cadastrado ainda.</span>
                            ) : (
                                projects.map((p) => (
                                    <label key={p.id} className="flex items-center gap-2 cursor-pointer text-xs font-medium">
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
}

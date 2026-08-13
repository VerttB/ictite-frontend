"use client";

import { UseFormReturn } from "react-hook-form";
import { SquareChartGantt, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SchoolFormDraftData, ClubDraftData } from "@/schemas/schoolSubmissionSchema";

interface ProjectItemFormProps {
    index: number;
    fieldId: string;
    form: UseFormReturn<SchoolFormDraftData>;
    clubs: ClubDraftData[];
    readOnly?: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onRemove: () => void;
}

export function ProjectItemForm({
    index,
    fieldId,
    form,
    clubs,
    readOnly = false,
    isExpanded,
    onToggleExpand,
    onRemove,
}: ProjectItemFormProps) {
    const { register, watch, formState: { errors } } = form;
    const projectName = watch(`projects.${index}.name`);

    return (
        <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden">
            <div
                onClick={onToggleExpand}
                className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-[#088077]/10 p-2 text-[#088077]">
                        <SquareChartGantt size={18} />
                    </span>
                    <h4 className="text-sm font-semibold text-gray-800">
                        {projectName || `Projeto de Pesquisa #${index + 1}`}
                    </h4>
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
                    <input type="hidden" {...register(`projects.${index}.id`)} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Nome do Projeto *
                            </label>
                            <Input
                                disabled={readOnly}
                                placeholder="Ex: Monitoramento da Qualidade da Água"
                                {...register(`projects.${index}.name`)}
                            />
                            {errors.projects?.[index]?.name && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <AlertCircle size={12} />
                                    {errors.projects[index]?.name?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Ano
                            </label>
                            <Input
                                type="number"
                                disabled={readOnly}
                                {...register(`projects.${index}.year`, { valueAsNumber: true })}
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
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                        >
                            {clubs.length === 0 ? (
                                <option value="">Nenhum clube cadastrado - Cadastre um clube na aba Clubes</option>
                            ) : (
                                clubs.map((club) => (
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
                        <Textarea
                            rows={2}
                            disabled={readOnly}
                            placeholder="Breve resumo sobre os objetivos do projeto..."
                            {...register(`projects.${index}.description`)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

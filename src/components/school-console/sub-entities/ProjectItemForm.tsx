"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import {
    SquareChartGantt,
    Trash2,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    SchoolFormDraftData,
    ClubDraftData,
    SchoolFormDataInput,
} from "@/schemas/schoolSubmissionSchema";

interface ProjectItemFormProps {
    index: number;
    fieldId: string;
    form: UseFormReturn<SchoolFormDataInput>;
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
    const {
        register,
        control,
        watch,
        formState: { errors },
    } = form;
    const project = watch(`projects.${index}`);
    const projectError = errors.projects?.[index];

    const hasError = Boolean(projectError);
    const isIncomplete =
        !project?.name ||
        project.name.trim().length < 2 ||
        !project?.clube_ciencia_id ||
        project.clube_ciencia_id === "disabled";

    let borderClass = "border-l-4 border-l-[#088077]";
    let iconBgClass = "bg-[#088077]/10 text-[#088077]";
    let badge = (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            <CheckCircle2 size={11} /> Completo
        </span>
    );

    if (hasError) {
        borderClass = "border-l-4 border-l-red-500";
        iconBgClass = "bg-red-100 text-red-600";
        badge = (
            <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                <AlertCircle size={11} /> Erro
            </span>
        );
    } else if (isIncomplete) {
        borderClass = "border-l-4 border-l-amber-500";
        iconBgClass = "bg-amber-100 text-amber-600";
        badge = (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                <AlertTriangle size={11} /> Pendente
            </span>
        );
    }

    return (
        <div
            className={`animate-in fade-in-50 slide-in-from-top-4 relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 shadow-xs transition-all duration-300 hover:bg-white ${borderClass}`}>
            <div
                onClick={onToggleExpand}
                className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-4 transition-colors select-none hover:bg-gray-100/50">
                <div className="flex items-center gap-3">
                    <span className={`rounded-xl p-2 ${iconBgClass}`}>
                        <SquareChartGantt size={18} />
                    </span>
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                            {project?.name || `Projeto de Pesquisa #${index + 1}`}
                        </h4>
                        {badge}
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
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700">
                            <Trash2 size={16} />
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="animate-fade-in space-y-4 bg-white p-5">
                    <input type="hidden" {...register(`projects.${index}.id`)} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                Nome do Projeto (Obrigatório)
                            </label>
                            <Input
                                disabled={readOnly}
                                placeholder="Ex: Monitoramento da Qualidade da Água"
                                {...register(`projects.${index}.name`)}
                            />
                            {errors.projects?.[index]?.name && (
                                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                                    <AlertCircle size={12} />
                                    {errors.projects[index]?.name?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                Ano
                            </label>
                            <Input
                                type="number"
                                disabled={readOnly}
                                {...register(`projects.${index}.year`, {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Clube de Ciência Vinculado (Obrigatório)
                        </label>
                        <Controller
                            control={control}
                            name={`projects.${index}.clube_ciencia_id`}
                            render={({ field }) => (
                                <Select
                                    disabled={readOnly}
                                    value={field.value}
                                    onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full bg-white">
                                        <SelectValue placeholder="Selecione um clube de ciência..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clubs.length === 0 ? (
                                            <SelectItem value="disabled" disabled>
                                                Nenhum clube cadastrado
                                            </SelectItem>
                                        ) : (
                                            clubs.map((club) => (
                                                <SelectItem key={club.id} value={club.id}>
                                                    {club.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
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

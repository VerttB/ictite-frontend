"use client";

import { UseFormReturn, Controller } from "react-hook-form";
import { Book, Trash2, ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    const { register, control, watch, formState: { errors } } = form;
    const researcher = watch(`researchers.${index}`);
    const researcherError = errors.researchers?.[index];

    const hasError = Boolean(researcherError);
    const isIncomplete = !researcher?.name || researcher.name.trim().length < 2 || !researcher?.type;

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
        <div className={`relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden animate-in fade-in-50 slide-in-from-top-4 duration-300 ${borderClass}`}>
            <div
                onClick={onToggleExpand}
                className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className={`rounded-xl p-2 ${iconBgClass}`}>
                        <Book size={18} />
                    </span>
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                            {researcher?.name || `Pesquisador #${index + 1}`}
                        </h4>
                        <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                            {researcher?.type || "Função não definida"}
                        </span>
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
                                Nome Completo (Obrigatório)
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
                                Função / Tipo (Obrigatório)
                            </label>
                            <Controller
                                control={control}
                                name={`researchers.${index}.type`}
                                render={({ field }) => (
                                    <Select
                                        disabled={readOnly}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Selecione o tipo..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(ResearcherTypes).map((typeVal) => (
                                                <SelectItem key={typeVal} value={typeVal}>
                                                    {typeVal}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Gênero
                            </label>
                            <Controller
                                control={control}
                                name={`researchers.${index}.gender`}
                                render={({ field }) => (
                                    <Select
                                        disabled={readOnly}
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Gênero..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(GenderTypes).map((genderVal) => (
                                                <SelectItem key={genderVal} value={genderVal}>
                                                    {genderVal}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Raça / Etnia
                            </label>
                            <Controller
                                control={control}
                                name={`researchers.${index}.race`}
                                render={({ field }) => (
                                    <Select
                                        disabled={readOnly}
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Raça/Etnia..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(RaceTypes).map((raceVal) => (
                                                <SelectItem key={raceVal} value={raceVal}>
                                                    {raceVal}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
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
                        <Controller
                            control={control}
                            name={`researchers.${index}.project_ids`}
                            render={({ field }) => {
                                const selectedProjectIds = Array.isArray(field.value)
                                    ? field.value
                                    : field.value
                                      ? [field.value]
                                      : [];

                                return (
                                    <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-sm">
                                        {projects.length === 0 ? (
                                            <span className="text-xs text-gray-400">
                                                Nenhum projeto cadastrado ainda.
                                            </span>
                                        ) : (
                                            projects.map((p) => (
                                                <label
                                                    key={p.id}
                                                    className="flex items-center gap-2 cursor-pointer text-xs font-medium"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        disabled={readOnly}
                                                        value={p.id}
                                                        checked={selectedProjectIds.includes(p.id)}
                                                        onChange={(event) => {
                                                            const nextProjectIds = event.target.checked
                                                                ? [...selectedProjectIds, p.id]
                                                                : selectedProjectIds.filter(
                                                                      (projectId) => projectId !== p.id
                                                                  );
                                                            field.onChange(nextProjectIds);
                                                        }}
                                                        className="rounded text-[#088077] focus:ring-[#088077]"
                                                    />
                                                    <span>{p.name}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

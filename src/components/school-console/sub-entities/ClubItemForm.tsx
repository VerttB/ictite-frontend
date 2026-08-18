"use client";

import { UseFormReturn } from "react-hook-form";
import {
    Handshake,
    Trash2,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SchoolFormDraftData } from "@/schemas/schoolSubmissionSchema";

interface ClubItemFormProps {
    index: number;
    fieldId: string;
    form: UseFormReturn<SchoolFormDraftData>;
    readOnly?: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onRemove: () => void;
}

export function ClubItemForm({
    index,
    fieldId,
    form,
    readOnly = false,
    isExpanded,
    onToggleExpand,
    onRemove,
}: ClubItemFormProps) {
    const {
        register,
        watch,
        formState: { errors },
    } = form;
    const club = watch(`clubs.${index}`);
    const clubError = errors.clubs?.[index];

    // Determine status
    const hasError = Boolean(clubError);
    const isIncomplete = !club?.name || club.name.trim().length < 2;

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
            {/* Header do Card */}
            <div
                onClick={onToggleExpand}
                className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-4 transition-colors select-none hover:bg-gray-100/50">
                <div className="flex items-center gap-3">
                    <span className={`rounded-xl p-2 ${iconBgClass}`}>
                        <Handshake size={18} />
                    </span>
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                            {club?.name || `Clube de Ciência #${index + 1}`}
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
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                            title="Remover clube">
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

            {/* Campos do Formulário do Clube */}
            {isExpanded && (
                <div className="animate-fade-in space-y-4 bg-white p-5">
                    <input type="hidden" {...register(`clubs.${index}.id`)} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                Nome do Clube de Ciência (Obrigatório)
                            </label>
                            <Input
                                disabled={readOnly}
                                placeholder="Ex: Clube de Astronomia Galileu"
                                {...register(`clubs.${index}.name`)}
                            />
                            {errors.clubs?.[index]?.name && (
                                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                                    <AlertCircle size={12} />
                                    {errors.clubs[index]?.name?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                URL do Instagram (Opcional)
                            </label>
                            <Input
                                type="url"
                                disabled={readOnly}
                                placeholder="https://instagram.com/clube"
                                {...register(`clubs.${index}.instagram_url`)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

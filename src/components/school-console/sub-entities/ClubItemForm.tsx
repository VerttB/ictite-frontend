"use client";

import { UseFormReturn } from "react-hook-form";
import { Handshake, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
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
    const { register, watch, formState: { errors } } = form;
    const clubName = watch(`clubs.${index}.name`);

    return (
        <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden">
            {/* Header do Card */}
            <div
                onClick={onToggleExpand}
                className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-[#088077]/10 p-2 text-[#088077]">
                        <Handshake size={18} />
                    </span>
                    <h4 className="text-sm font-semibold text-gray-800">
                        {clubName || `Clube de Ciência #${index + 1}`}
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
                            title="Remover clube"
                        >
                            <Trash2 size={16} />
                        </Button>
                    )}
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Button>
                </div>
            </div>

            {/* Campos do Formulário do Clube */}
            {isExpanded && (
                <div className="p-5 space-y-4 animate-fade-in bg-white">
                    <input type="hidden" {...register(`clubs.${index}.id`)} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Nome do Clube de Ciência *
                            </label>
                            <Input
                                disabled={readOnly}
                                placeholder="Ex: Clube de Astronomia Galileu"
                                {...register(`clubs.${index}.name`)}
                            />
                            {errors.clubs?.[index]?.name && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <AlertCircle size={12} />
                                    {errors.clubs[index]?.name?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
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

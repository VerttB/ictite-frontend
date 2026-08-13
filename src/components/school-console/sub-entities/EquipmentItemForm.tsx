"use client";

import useSWR from "swr";
import { UseFormReturn } from "react-hook-form";
import { Printer, Trash2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SchoolFormDraftData } from "@/schemas/schoolSubmissionSchema";
import { getEquipamentTypes } from "@/core/service/TipoEquipamentoService";
import { EquipmentType } from "@/core/domain/EquipmentType";

interface EquipmentItemFormProps {
    index: number;
    fieldId: string;
    form: UseFormReturn<SchoolFormDraftData>;
    readOnly?: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onRemove: () => void;
}

export function EquipmentItemForm({
    index,
    fieldId,
    form,
    readOnly = false,
    isExpanded,
    onToggleExpand,
    onRemove,
}: EquipmentItemFormProps) {
    const { register, watch, formState: { errors } } = form;
    const equipmentName = watch(`equipments.${index}.name`);
    const equipmentQty = watch(`equipments.${index}.quantity`);

    // Fetch equipment types from API via SWR
    const { data: equipmentTypes = [] } = useSWR<EquipmentType[]>(
        "/equipment-types/",
        getEquipamentTypes
    );

    return (
        <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-xs overflow-hidden">
            <div
                onClick={onToggleExpand}
                className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-gray-100 hover:bg-gray-100/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-[#088077]/10 p-2 text-[#088077]">
                        <Printer size={18} />
                    </span>
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                            {equipmentName || `Equipamento #${index + 1}`}
                        </h4>
                        <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                            {equipmentQty || 1} un
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
                    <input type="hidden" {...register(`equipments.${index}.id`)} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Nome do Equipamento */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Nome do Equipamento *
                            </label>
                            <Input
                                disabled={readOnly}
                                placeholder="Ex: Microscópio Biológico Binocular"
                                {...register(`equipments.${index}.name`)}
                            />
                            {errors.equipments?.[index]?.name && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <AlertCircle size={12} />
                                    {errors.equipments[index]?.name?.message}
                                </p>
                            )}
                        </div>

                        {/* Tipo do Equipamento */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Tipo do Equipamento *
                            </label>
                            <select
                                disabled={readOnly}
                                {...register(`equipments.${index}.type_equipment_id`)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#088077] focus:ring-2 focus:ring-[#088077]/20 transition-all disabled:bg-gray-100"
                            >
                                <option value="">Selecione o tipo...</option>
                                {equipmentTypes.map((eqType) => (
                                    <option key={eqType.id} value={eqType.id}>
                                        {eqType.name}
                                    </option>
                                ))}
                            </select>
                            {errors.equipments?.[index]?.type_equipment_id && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
                                    <AlertCircle size={12} />
                                    {errors.equipments[index]?.type_equipment_id?.message}
                                </p>
                            )}
                        </div>

                        {/* Quantidade */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Quantidade *
                            </label>
                            <Input
                                type="number"
                                min={1}
                                disabled={readOnly}
                                {...register(`equipments.${index}.quantity`, { valueAsNumber: true })}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

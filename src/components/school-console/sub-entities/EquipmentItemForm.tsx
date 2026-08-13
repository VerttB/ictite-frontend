"use client";

import useSWR from "swr";
import { UseFormReturn, Controller } from "react-hook-form";
import {
    Printer,
    Trash2,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    const {
        register,
        control,
        watch,
        formState: { errors },
    } = form;
    const equipment = watch(`equipments.${index}`);
    const equipmentError = errors.equipments?.[index];

    const { data: equipmentTypes = [] } = useSWR<EquipmentType[]>(
        "/equipment-types/",
        getEquipamentTypes
    );

    const hasError = Boolean(equipmentError);
    const isIncomplete =
        !equipment?.name ||
        equipment.name.trim().length < 2 ||
        !equipment?.type_equipment_id ||
        !equipment?.quantity;

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
                        <Printer size={18} />
                    </span>
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                            {equipment?.name || `Equipamento #${index + 1}`}
                        </h4>
                        <span className="rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                            {equipment?.quantity || 1} un
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
                    <input type="hidden" {...register(`equipments.${index}.id`)} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                Nome do Equipamento (Obrigatório)
                            </label>
                            <Input
                                disabled={readOnly}
                                placeholder="Ex: Microscópio Biológico Binocular"
                                {...register(`equipments.${index}.name`)}
                            />
                            {errors.equipments?.[index]?.name && (
                                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                                    <AlertCircle size={12} />
                                    {errors.equipments[index]?.name?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                Tipo do Equipamento (Obrigatório)
                            </label>
                            <Controller
                                control={control}
                                name={`equipments.${index}.type_equipment_id`}
                                render={({ field }) => (
                                    <Select
                                        disabled={readOnly}
                                        value={field.value}
                                        onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Selecione o tipo..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {equipmentTypes.map((eqType) => (
                                                <SelectItem
                                                    key={eqType.id}
                                                    value={eqType.id}>
                                                    {eqType.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.equipments?.[index]?.type_equipment_id && (
                                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
                                    <AlertCircle size={12} />
                                    {errors.equipments[index]?.type_equipment_id?.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">
                                Quantidade (Obrigatório)
                            </label>
                            <Input
                                type="number"
                                min={1}
                                disabled={readOnly}
                                {...register(`equipments.${index}.quantity`, {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

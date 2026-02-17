import { useFormContext, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { SimpleIdName } from "@/schemas/Common";

interface ControlledMultiSelectProps {
    name: string;
    label: string;
    options: SimpleIdName[] | string[] | number[];
    className?: string;
}

export const ControlledMultiSelect = ({
    name,
    label,
    options,
    className = "",
}: ControlledMultiSelectProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className={`${className}`}>
            <label className="mb-1 block text-sm">{label}</label>

            <Controller
                name={name}
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                    const selectedValues: string[] = field.value || [];

                    return (
                        <div>
                            <Select
                                onValueChange={(value) => {
                                    if (!selectedValues.includes(value)) {
                                        field.onChange([...selectedValues, value]);
                                    }
                                }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={`Selecione ${label.toLowerCase()}`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((opt) => {
                                        const optId =
                                            typeof opt === "object"
                                                ? opt.id
                                                : opt.toString();
                                        const optName =
                                            typeof opt === "object" ? opt.name : opt;
                                        return (
                                            <SelectItem key={optId} value={optId}>
                                                {optName}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {options.map((opt) => {
                                    const optId =
                                        typeof opt === "object" ? opt.id : opt.toString();
                                    const optName =
                                        typeof opt === "object" ? opt.name : opt;

                                    if (selectedValues.includes(optId)) {
                                        return (
                                            <div
                                                key={optId}
                                                className="bg-azul-claro text-font-primary flex items-center gap-1 rounded-full border-2 px-3 py-1 text-sm">
                                                <span>{optName}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 rounded-full"
                                                    onClick={() => {
                                                        field.onChange(
                                                            selectedValues.filter(
                                                                (id) => id !== optId
                                                            )
                                                        );
                                                    }}>
                                                    <X size={12} color="red" />
                                                </Button>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    );
                }}
            />

            {errors[name] && (
                <p className="mt-1 text-sm text-red-500">
                    {errors[name].message as string}
                </p>
            )}
        </div>
    );
};

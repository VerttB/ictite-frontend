interface ControlledSelectProps {
    name: string;
    label: string;
    options: { id: string; name: string }[] | string[];
    className?: string;
}

import { useFormContext, Controller } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export const ControlledSelect = ({
    name,
    label,
    options,
    className = "",
}: ControlledSelectProps) => {
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
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={`Selecione ${label.toLowerCase()}`}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((opt) => (
                                <SelectItem
                                    key={typeof opt === "string" ? opt : opt.id}
                                    value={typeof opt === "string" ? opt : opt.id}>
                                    {typeof opt === "string" ? opt : opt.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />

            {errors[name] && (
                <p className="text-sm text-red-500">{errors[name].message as string}</p>
            )}
        </div>
    );
};

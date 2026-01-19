import { useFormContext, Controller } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { SimpleIdName } from "@/schemas/Common";

interface ControlledSelectProps {
    name: string;
    label: string;
    options: SimpleIdName[] | string[] | number[];
    className?: string;
}
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
                                    key={typeof opt === "object" ? opt.id : opt}
                                    value={
                                        typeof opt === "object" ? opt.id : opt.toString()
                                    }>
                                    {typeof opt === "object" ? opt.name : opt}
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

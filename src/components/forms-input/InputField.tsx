import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";

interface InputFieldProps {
    name: string;
    label: string;
    mask?: (value: string) => string;
    maxLength?: number;
}

export const InputField = ({ name, label, mask, maxLength }: InputFieldProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const { onChange, ...rest } = register(name, { maxLength });
    return (
        <div>
            <label className="mb-1 block text-sm">{label}</label>
            <Input
                {...rest}
                maxLength={maxLength}
                onChange={(e) => {
                    if (mask) {
                        e.target.value = mask(e.target.value);
                    }
                    onChange(e);
                }}
            />
            {errors[name] && (
                <p className="text-sm text-red-500">{errors[name].message as string}</p>
            )}
        </div>
    );
};

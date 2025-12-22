import { useFormContext } from "react-hook-form";
import { Input } from "./input";

interface InputFieldProps {
    name: string;
    label: string;
    mask?: (value: string) => string;
}

export const InputField = ({ name, label, mask }: InputFieldProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const { onChange, ...rest } = register(name);
    return (
        <div>
            <label className="mb-1 block text-sm">{label}</label>
            <Input
                {...rest}
                onChange={(e) => {
                    if (mask) {
                        e.target.value = mask(e.target.value);
                    }
                    onChange(e);
                }}
            />
            {errors[name] && (
                <p className="text-sm text-red-500">
                    {errors[name].message as string}
                </p>
            )}
        </div>
    );
};

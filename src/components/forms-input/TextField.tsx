import { useFormContext } from "react-hook-form";

interface TextFieldProps {
    name: string;
    label: string;
    maxLength?: number;
}

export const TextField = ({ name, label, maxLength }: TextFieldProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();
    const { onChange, ...rest } = register(name, { maxLength });
    return (
        <div>
            <label className="mb-1 block text-sm">{label}</label>
            <textarea
                {...rest}
                maxLength={maxLength}
                onChange={(e) => {
                    onChange(e);
                }}
            />
            {errors[name] && (
                <p className="text-sm text-red-500">{errors[name].message as string}</p>
            )}
        </div>
    );
};

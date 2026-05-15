import { Controller, useFormContext } from "react-hook-form";
import { ImageUploadInput } from "../ImageInput";

interface ControlledImageUploadProps {
    name: string;
    label?: string;
    multiple?: boolean;
}

export const ControlledImageUpload = ({
    name,
    label = "Imagens",
    multiple = false,
}: ControlledImageUploadProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <ImageUploadInput
                    label={label}
                    multiple={multiple}
                    value={field.value}
                    onChange={field.onChange}
                    errors={errors[name]?.message as string}
                />
            )}
        />
    );
};

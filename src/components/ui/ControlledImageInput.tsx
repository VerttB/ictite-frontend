import { Controller, useFormContext } from "react-hook-form";
import { ImageUploadInput } from "../ImageInput";

interface ControlledImageUploadProps {
  name: string;
}

export const ControlledImageUpload = ({ name}: ControlledImageUploadProps) => {
  const { control, formState: { errors } } = useFormContext();
  
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ImageUploadInput 
          label="Imagens"
          multiple={false}
          value={field.value}
          onChange={field.onChange}
          errors={errors[name]?.message as string}
        />
      )}
    />
  );
}

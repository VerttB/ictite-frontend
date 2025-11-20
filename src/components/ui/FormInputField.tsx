import { useFormContext } from "react-hook-form";
import { Input } from "./input";

interface InputFieldProps {
  name: string;
  label: string;
  mask?: (value: string) => string;
}

export const InputField = ({ name, label, mask }: InputFieldProps) => {
  const { register, formState: { errors }, getValues } = useFormContext();

  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <Input {...register(name)}
              onChange={(e) => e.target.value = mask ? mask(e.target.value) : e.target.value}  />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name].message as string}</p>}
    </div>
  );
}

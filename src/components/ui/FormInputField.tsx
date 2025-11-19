import { useFormContext } from "react-hook-form";
import { Input } from "./input";

interface InputFieldProps {
  name: string;
  label: string;
}

export const InputField = ({ name, label }: InputFieldProps) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <Input {...register(name)} />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name].message as string}</p>}
    </div>
  );
}

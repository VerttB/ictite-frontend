"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "@/schemas/LoginSchema";
import { useUserContext } from "@/providers/UserContext";
export default function Login() {
    const { loginUser } = useUserContext();

    type userLoginData = z.infer<typeof userLoginSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<userLoginData>({
        resolver: zodResolver(userLoginSchema),
    });

    const onSubmit = async (data: userLoginData) => {
        const success = await loginUser(data);
        if (!success) {
            setError("root", {
                type: "manual",
                message: "Falha no login. Verifique suas credenciais.",
            });
        }
    };

    return (
        <div className="flex h-full items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 text-lg font-medium 2xl:text-xl">
                <label htmlFor="email" className="flex flex-col gap-2">
                    Nome
                    <Input
                        {...register("email")}
                        type="text"
                        className="bg-background #b5b5b5 rounded-md border-1 border-gray-300 px-2 py-2"
                    />
                    <span className="text-sm text-red-500">
                        {errors && errors.email?.message}
                    </span>
                </label>
                <label htmlFor="password" className="flex flex-col gap-2">
                    Senha
                    <Input
                        {...register("password")}
                        type="password"
                        className="bg-background rounded-md border-1 border-gray-300 px-2 py-2"
                    />
                    <span className="text-sm text-red-500">
                        {errors && errors.password?.message}
                    </span>
                </label>
                {errors && (
                    <p className="text-sm text-red-500">
                        {errors.root?.message}
                    </p>
                )}
                <Button type="submit">Fazer Login</Button>
            </form>
        </div>
    );
}
